import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Camera, X, CheckCircle, AlertCircle, Trash2, Upload, User, Monitor } from 'lucide-react';
import jsQR from 'jsqr';

interface Assignment {
  id: number;
  employee: string;
  remote: string;
  timestamp: string;
}

interface Employee {
  id: number;
  code: string;
  timestamp: string;
  hasRemote: boolean;
}

type ScanType = 'employee' | 'remote' | '';
type ScanMode = 'camera' | 'upload';

const QRScannerPage = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanType, setScanType] = useState<ScanType>('');
  const [scanMode, setScanMode] = useState<ScanMode>('camera');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isProcessingScan, setIsProcessingScan] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const scanQRCode = (imageData: ImageData): string | null => {
    try {
      const code = jsQR(
        imageData.data,
        imageData.width,
        imageData.height,
        { inversionAttempts: 'attemptBoth' }
      );
      return code ? code.data : null;
    } catch (error) {
      console.error('QR scanning error:', error);
      return null;
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, type: ScanType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanType(type);
    setIsProcessingScan(true);
    setMessage('Processing QR code...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          setMessage('Failed to process image');
          setIsProcessingScan(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const result = scanQRCode(imageData);

          if (result) {
            handleScanResult(result, type);
          } else {
            setMessage('No QR code found in the image');
          }
        } catch (error) {
          console.error('Image processing error:', error);
          setMessage('Failed to read QR code from image');
        }
        
        setIsProcessingScan(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      img.onerror = () => {
        setMessage('Invalid image file');
        setIsProcessingScan(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setMessage('Failed to read file');
      setIsProcessingScan(false);
    };
    reader.readAsDataURL(file);
  };

  const captureAndScan = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(captureAndScan);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const result = scanQRCode(imageData);

    if (result) {
      handleScanSuccess(result);
    } else {
      animationFrameRef.current = requestAnimationFrame(captureAndScan);
    }
  };

  const handleScanSuccess = (result: string) => {
    setIsProcessingScan(true);
    handleScanResult(result, scanType);

    setTimeout(() => {
      stopScanning();
      setIsProcessingScan(false);
    }, 500);
  };

  const handleScanResult = (result: string, type: ScanType) => {
    if (type === 'employee') {
      // Check if employee already exists
      const existingEmployee = employees.find(emp => emp.code === result);
      if (existingEmployee) {
        setMessage(`Employee ${result} already exists`);
        return;
      }

      // Add new employee
      const newEmployee: Employee = {
        id: Date.now(),
        code: result,
        timestamp: new Date().toLocaleString(),
        hasRemote: false
      };
      setEmployees(prev => [...prev, newEmployee]);
      setMessage(`Employee ${result} added`);

    } else if (type === 'remote') {
      // Check if remote is already assigned
      const existingAssignment = assignments.find(assignment => assignment.remote === result);
      if (existingAssignment) {
        setMessage(`Remote ${result} is already assigned to ${existingAssignment.employee}`);
        return;
      }

      // Find first employee without a remote
      const availableEmployee = employees.find(emp => !emp.hasRemote);
      if (!availableEmployee) {
        setMessage('No employees available for assignment. Please scan an employee first.');
        return;
      }

      // Create automatic assignment
      const newAssignment: Assignment = {
        id: Date.now(),
        employee: availableEmployee.code,
        remote: result,
        timestamp: new Date().toLocaleString()
      };

      // Update assignments and mark employee as having a remote
      setAssignments(prev => [...prev, newAssignment]);
      setEmployees(prev => prev.map(emp => 
        emp.id === availableEmployee.id ? { ...emp, hasRemote: true } : emp
      ));
      
      setMessage(`Remote ${result} automatically assigned to employee ${availableEmployee.code}`);
    }
  };

  const startScanning = (type: ScanType) => {
    setScanType(type);
    setIsScanning(true);
    setMessage('');

    navigator.mediaDevices.getUserMedia({ 
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }).then(stream => {
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play()
          .then(() => {
            animationFrameRef.current = requestAnimationFrame(captureAndScan);
            scanTimeoutRef.current = window.setTimeout(() => {
              setMessage('Scanning timed out. Try better lighting or closer distance');
              stopScanning();
            }, 20000);
          })
          .catch(err => {
            console.error('Video play error:', err);
            setMessage('Failed to start camera');
            stopScanning();
          });
      }
    }).catch(err => {
      console.error('Camera error:', err);
      setMessage('Camera access denied. Please enable camera permissions');
      setIsScanning(false);
    });
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanType('');
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (scanTimeoutRef.current) {
      window.clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const removeAssignment = (id: number) => {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
      // Mark employee as not having a remote
      setEmployees(prev => prev.map(emp => 
        emp.code === assignment.employee ? { ...emp, hasRemote: false } : emp
      ));
    }
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    setMessage('Assignment removed');
  };

  const removeEmployee = (id: number) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      // Remove any assignments for this employee
      setAssignments(prev => prev.filter(assignment => assignment.employee !== employee.code));
    }
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setMessage('Employee removed');
  };

  const clearAll = () => {
    setEmployees([]);
    setAssignments([]);
    setMessage('All data cleared');
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scanTimeoutRef.current) {
        window.clearTimeout(scanTimeoutRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const availableEmployees = employees.filter(emp => !emp.hasRemote);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Auto Employee & Remote Assignment
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableEmployees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <button
              onClick={clearAll}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Scan Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow p-1">
            <button
              onClick={() => setScanMode('camera')}
              className={`px-4 py-2 rounded-md ${scanMode === 'camera' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            >
              <Camera size={18} className="inline mr-2" />
              Camera Scan
            </button>
            <button
              onClick={() => setScanMode('upload')}
              className={`px-4 py-2 rounded-md ${scanMode === 'upload' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            >
              <Upload size={18} className="inline mr-2" />
              Upload QR
            </button>
          </div>
        </div>

        {/* Scanning Interface */}
        {scanMode === 'camera' ? (
          isScanning ? (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Scanning {scanType === 'employee' ? 'Employee' : 'Remote'} QR Code
                </h2>
                <button
                  onClick={stopScanning}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg opacity-75"></div>
                </div>
              </div>

              {isProcessingScan ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-sm text-gray-600">Processing QR code...</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Position the QR code within the frame
                  </p>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full animate-pulse" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan QR Codes</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => startScanning('employee')}
                  disabled={isScanning}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg transition-colors"
                >
                  <Camera size={20} />
                  Scan Employee QR
                </button>
                
                <button
                  onClick={() => startScanning('remote')}
                  disabled={isScanning || availableEmployees.length === 0}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg transition-colors"
                >
                  <Camera size={20} />
                  Scan Remote QR
                  {availableEmployees.length === 0 && (
                    <span className="text-xs">(No employees available)</span>
                  )}
                </button>
              </div>

              {availableEmployees.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Next Assignment Will Go To:</h3>
                  <span className="font-mono text-blue-600">{availableEmployees[0].code}</span>
                  <span className="text-sm text-blue-600 ml-2">
                    (Added: {availableEmployees[0].timestamp})
                  </span>
                </div>
              )}

              {message && (
                <div className={`flex items-center gap-2 p-3 rounded-md ${
                  message.includes('added') || message.includes('assigned') ? 'bg-green-100 text-green-700' : 
                  message.includes('already') || message.includes('No employees') ? 'bg-red-100 text-red-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  <AlertCircle size={16} />
                  {message}
                </div>
              )}
            </div>
          )
        ) : (
          /* File upload scanning UI */
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload QR Codes</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'employee')}
                  className="hidden"
                  id="employee-upload"
                />
                <label
                  htmlFor="employee-upload"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition-colors cursor-pointer"
                >
                  <Upload size={20} />
                  Upload Employee QR
                </label>
              </div>
              
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'remote')}
                  className="hidden"
                  id="remote-upload"
                  disabled={availableEmployees.length === 0}
                />
                <label
                  htmlFor="remote-upload"
                  className={`flex items-center justify-center gap-2 px-6 py-4 rounded-lg transition-colors cursor-pointer ${
                    availableEmployees.length === 0 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <Upload size={20} />
                  Upload Remote QR
                  {availableEmployees.length === 0 && (
                    <span className="text-xs">(No employees available)</span>
                  )}
                </label>
              </div>
            </div>
            
            {isProcessingScan && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-sm text-gray-600">Processing QR code...</p>
              </div>
            )}
            
            {availableEmployees.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-700 mb-2">Next Assignment Will Go To:</h3>
                <span className="font-mono text-blue-600">{availableEmployees[0].code}</span>
                <span className="text-sm text-blue-600 ml-2">
                  (Added: {availableEmployees[0].timestamp})
                </span>
              </div>
            )}

            {message && (
              <div className={`flex items-center gap-2 p-3 rounded-md ${
                message.includes('added') || message.includes('assigned') ? 'bg-green-100 text-green-700' : 
                message.includes('already') || message.includes('No employees') || message.includes('No QR') || message.includes('Failed') ? 'bg-red-100 text-red-700' : 
                'bg-blue-100 text-blue-700'
              }`}>
                <AlertCircle size={16} />
                {message}
              </div>
            )}
          </div>
        )}

        {/* Employees List */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Employees ({employees.length})
              </h2>
            </div>
            
            {employees.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No employees scanned yet.
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Employee Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-mono text-blue-600">
                            {employee.code}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.hasRemote 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {employee.hasRemote ? 'Assigned' : 'Available'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => removeEmployee(employee.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Remove employee"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Assignments List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Assignments ({assignments.length})
              </h2>
            </div>
            
            {assignments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No assignments yet.
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Remote
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-mono text-blue-600">
                            {assignment.employee}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-mono text-green-600">
                            {assignment.remote}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => removeAssignment(assignment.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Remove assignment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;