import ctypes
from ctypes import c_int, c_char_p, c_void_p, CFUNCTYPE

class EasyTest:
    def __init__(self):
        self.lib = ctypes.CDLL("./resources/EasyTestSDK_x64.dll")
        self._connect_cb = CFUNCTYPE(None, c_int, c_int, c_char_p)(self._on_connect)
        self._vote_cb = CFUNCTYPE(None, c_int, c_int, c_char_p)(self._on_vote)
        self._key_cb = CFUNCTYPE(None, c_int, c_int, c_char_p, c_int, ctypes.c_float, c_char_p)(self._on_key)
        self._hd_cb = CFUNCTYPE(None, c_int, c_int, c_char_p)(self._on_hd_param)
        self._keypad_cb = CFUNCTYPE(None, c_int, c_int, c_char_p, c_int, c_char_p)(self._on_keypad_param)

        self._define_functions()
        self._register_callbacks()

        # Initialize SDK
        self.lib.License(1, b"SUNARS2013")
        self.lib.SetLogOn(0)
        self.lib.Connect(2, b"")

    def _define_functions(self):
        self.lib.License.argtypes = [c_int, c_char_p]
        self.lib.License.restype = c_int

        self.lib.Connect.argtypes = [c_int, c_char_p]
        self.lib.Connect.restype = c_int

        self.lib.Disconnect.argtypes = [c_int]
        self.lib.Disconnect.restype = c_int

        self.lib.WriteHDParam.argtypes = [c_int, c_int, c_char_p]
        self.lib.WriteHDParam.restype = c_int

        self.lib.ReadHDParam.argtypes = [c_int, c_int]
        self.lib.ReadHDParam.restype = c_int

        self.lib.WriteKeypadParam.argtypes = [c_int, c_int, c_char_p, c_int, c_char_p]
        self.lib.WriteKeypadParam.restype = c_int

        self.lib.ReadKeypadParam.argtypes = [c_int, c_int, c_char_p, c_int, c_char_p]
        self.lib.ReadKeypadParam.restype = c_int

        self.lib.VoteStart2.argtypes = [c_int, c_int, c_char_p]
        self.lib.VoteStart2.restype = c_int

        self.lib.VoteStop2.argtypes = [c_int]
        self.lib.VoteStop2.restype = c_int

        self.lib.GetMultiResultByID.argtypes = [c_char_p, c_int, c_int]
        self.lib.GetMultiResultByID.restype = c_int

        self.lib.GetResultBySN.argtypes = [c_char_p, c_int, c_int]
        self.lib.GetResultBySN.restype = c_int

        self.lib.ExitGetResult.argtypes = []
        self.lib.ExitGetResult.restype = c_int

        self.lib.SetLogOn.argtypes = [c_int]
        self.lib.SetLogOn.restype = c_int

        self.lib.SetConnectEventCallBack.argtypes = [type(self._connect_cb)]
        self.lib.SetHDParamEventCallBack.argtypes = [type(self._hd_cb)]
        self.lib.SetKeypadParamEventCallBack.argtypes = [type(self._keypad_cb)]
        self.lib.SetVoteEventCallBack.argtypes = [type(self._vote_cb)]
        self.lib.SetKeyEventCallBack.argtypes = [type(self._key_cb)]

    def _register_callbacks(self):
        self.lib.SetConnectEventCallBack(self._connect_cb)
        self.lib.SetVoteEventCallBack(self._vote_cb)
        self.lib.SetKeyEventCallBack(self._key_cb)
        self.lib.SetHDParamEventCallBack(self._hd_cb)
        self.lib.SetKeypadParamEventCallBack(self._keypad_cb)

    # SDK method wrappers
    def connect(self, conn_type: int, conn_str: str):
        return self.lib.Connect(conn_type, conn_str.encode())

    def disconnect(self, base_id: int):
        return self.lib.Disconnect(base_id)

    def vote_start(self, base_id: int, vote_type: int, config: str):
        return self.lib.VoteStart2(base_id, vote_type, config.encode())

    def vote_stop(self, base_id: int):
        return self.lib.VoteStop2(base_id)

    # Callbacks (override or extend if subclassing)
    def _on_connect(self, base_id, mode, info):
        print(f"[Connect] BaseID: {base_id}, Mode: {mode}, Info: {info.decode()}")
        if info.decode() == "1":
            print("Connected. Starting vote...")
            self.vote_start(0, 10, "1,1,0,0,4,1")

    def _on_vote(self, base_id, mode, info):
        print(f"[Vote] BaseID: {base_id}, Mode: {mode}, Info: {info.decode()}")

    def _on_key(self, base_id, key_id, key_sn, mode, timestamp, info):
        print(f"[Key] BaseID: {base_id}, KeyID: {key_id}, KeySN: {key_sn.decode()}, Mode: {mode}, Time: {timestamp}, Info: {info.decode()}")
        

    def _on_hd_param(self, base_id, mode, info):
        print(f"[HD Param] BaseID: {base_id}, Mode: {mode}, Info: {info.decode()}")

    def _on_keypad_param(self, base_id, key_id, key_sn, mode, info):
        print(f"[Keypad Param] BaseID: {base_id}, KeyID: {key_id}, KeySN: {key_sn.decode()}, Mode: {mode}, Info: {info.decode()}")

    







    

