import ctypes
import threading
import time
from ctypes import c_int, c_char_p, c_void_p, POINTER, CFUNCTYPE
from django.utils import timezone
from django.db import transaction
from .models import Device, KeypadEvent, VoteSession
from core.easy_test import EasyTest
import logging

logger = logging.getLogger(__name__)

class DjangoEasyTestHandler(EasyTest):
    def __init__(self):
        super().__init__()
        self.running = False
        self.connection_attempts = 0
        self.max_connection_attempts = 5

    def _on_connect(self, base_id, mode, info):
        super()._on_connect(base_id, mode, info)
        logger.info(f"📡 Device Connected: ID={base_id}, Mode={mode.decode()}, Info={info.decode()}")
        
        try:
            with transaction.atomic():
                device, created = Device.objects.get_or_create(
                    base_id=base_id,
                    defaults={
                        'mode': mode.decode() if mode else '',
                        'info': info.decode() if info else '',
                        'status': 'connected'
                    }
                )
                
                if not created:
                    device.mode = mode.decode() if mode else ''
                    device.info = info.decode() if info else ''
                    device.status = 'connected'
                    device.save()
                
                # Auto-start vote if info is "1"
                if info.decode() == "1":
                    logger.info(f"Auto-starting vote for device {base_id}")
                    self.vote_start(0, 10, "1,1,0,0,4,1")
                    
                    VoteSession.objects.create(
                        device=device,
                        session_id=0,
                        duration=10,
                        config="1,1,0,0,4,1",
                        status='active'
                    )
                    
                logger.info(f"Device {base_id} {'created' if created else 'updated'} in database")
                
        except Exception as e:
            logger.error(f"Error handling device connection: {e}")

    def _on_key(self, base_id, key_id, key_sn, mode, timestamp, info):
        key_sn_str = key_sn.decode() if key_sn else ''
        info_str = info.decode().strip() if info else ''
        mode_str = info.decode() if mode else ''

        logger.info(f"🧭 Keypad Event: BaseID={base_id}, KeyID={key_id}, SN={key_sn_str}, Info={repr(info_str)}, Time={timestamp}")

        try:
            with transaction.atomic():
                device = Device.objects.get(base_id=base_id)
                
                KeypadEvent.objects.create(
                    device=device,
                    key_id=key_id,
                    key_sn=key_sn_str,
                    mode=mode_str,
                    timestamp=timestamp,
                    info=info_str,
                    processed=False
                )
                
                logger.info(f"Keypad event saved for device {base_id}")
                
        except Device.DoesNotExist:
            logger.error(f"Device with base_id {base_id} not found in database")
        except Exception as e:
            logger.error(f"Error saving keypad event: {e}")

    def connect_with_retry(self, base_id, mode):
        """Try to connect with retry logic"""
        for attempt in range(self.max_connection_attempts):
            try:
                logger.info(f"Connection attempt {attempt + 1}/{self.max_connection_attempts}")
                result = self.connect(base_id, mode)
                if result:  # Assuming connect returns True on success
                    logger.info("Connection successful!")
                    return True
                else:
                    logger.warning(f"Connection attempt {attempt + 1} failed")
                    time.sleep(2)  # Wait 2 seconds before retry
            except Exception as e:
                logger.error(f"Connection attempt {attempt + 1} failed with error: {e}")
                time.sleep(2)
        
        logger.error("All connection attempts failed")
        return False

class RemoteDataService:
    def __init__(self):
        self.sdk = None
        self.thread = None
        self.running = False
        self.connection_status = "disconnected"
        self.last_error = None

    def start_service(self, base_id=1, mode="auto"):
        if self.running:
            logger.warning("Service is already running")
            return False

        try:
            self.sdk = DjangoEasyTestHandler()
            self.connection_status = "connecting"
            
            # Try to connect with retry logic
            if self.sdk.connect_with_retry(base_id, mode):
                self.running = True
                self.connection_status = "connected"
                self.last_error = None
                
                # Start monitoring in a separate thread
                self.thread = threading.Thread(target=self._monitor_loop, daemon=True)
                self.thread.start()
                
                logger.info("🔄 Remote data service started successfully")
                return True
            else:
                self.connection_status = "failed"
                self.last_error = "Failed to connect after multiple attempts"
                return False
                
        except Exception as e:
            self.connection_status = "error"
            self.last_error = str(e)
            logger.error(f"Failed to start remote data service: {e}")
            return False

    def stop_service(self):
        if not self.running:
            return True

        self.running = False
        self.connection_status = "disconnected"
        
        if self.sdk:
            # Add cleanup code here if your EasyTest class supports it
            try:
                # If your EasyTest has a disconnect method, call it here
                # self.sdk.disconnect()
                pass
            except Exception as e:
                logger.error(f"Error during disconnect: {e}")
            
        logger.info("🛑 Remote data service stopped")
        return True

    def _monitor_loop(self):
        """Keep the service running and monitor connection"""
        try:
            while self.running:
                # Add health check here if your EasyTest supports it
                # You might want to ping the device periodically
                time.sleep(1)
        except Exception as e:
            logger.error(f"Error in monitor loop: {e}")
            self.running = False
            self.connection_status = "error"
            self.last_error = str(e)

    def get_status(self):
        return {
            'running': self.running,
            'connection_status': self.connection_status,
            'last_error': self.last_error,
            'connected_devices': Device.objects.filter(status='connected').count(),
            'total_events': KeypadEvent.objects.count(),
            'active_vote_sessions': VoteSession.objects.filter(status='active').count()
        }

    def reconnect(self, base_id=1, mode="auto"):
        """Force reconnection"""
        if self.running:
            self.stop_service()
            time.sleep(1)
        
        return self.start_service(base_id, mode)

# Global service instance
remote_service = RemoteDataService()