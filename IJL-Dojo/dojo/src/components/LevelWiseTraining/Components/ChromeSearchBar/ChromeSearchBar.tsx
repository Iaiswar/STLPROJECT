import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ScanLine, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import Nav from '../../../HomeNav/nav';

// Updated Type definitions for Operator Master
interface OperatorMaster {
  id: number;
  sr_no: number;
  employee_code: string;
  full_name: string;
  date_of_join: string | null;
  employee_pattern_category: string;
  designation: string;
  department: string;
  department_code: string;
}

interface LocationState {
  lineId?: string;
  lineName?: string;
  prevpage?: string;
  sectionTitle?:string;
}

interface ApiResponse {
  results?: OperatorMaster[];
  data?: OperatorMaster[];
}

const SearchBarWithQRScanner = () => {
  const location = useLocation();
  const { lineId, lineName, prevpage,sectionTitle } = (location.state as LocationState) || {};

  console.log('Received state:', { lineId, lineName, prevpage,sectionTitle });

  const [query, setQuery] = useState<string>('');
  const [operators, setOperators] = useState<OperatorMaster[]>([]);
  const [filteredOperators, setFilteredOperators] = useState<OperatorMaster[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedOperator, setSelectedOperator] = useState<OperatorMaster | null>(null);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const scannerRef = useRef<HTMLDivElement>(null);
  const qrCodeScannerRef = useRef<Html5Qrcode | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch operators from API
  useEffect(() => {
    const fetchOperators = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/operators-master/');
        if (response.ok) {
          const data: ApiResponse = await response.json();
          console.log('API Response:', data);
          const operatorData = data.results || data.data || (Array.isArray(data) ? data : []);
          setOperators(operatorData as OperatorMaster[]);
        } else {
          console.error('Failed to fetch operators');
        }
      } catch (error) {
        console.error('Error fetching operators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  // Filter operators based on query - real-time like YouTube
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim() && operators.length > 0) {
        const filtered = operators.filter(operator =>
          operator.full_name.toLowerCase().includes(query.toLowerCase()) ||
          operator.employee_code.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredOperators(filtered.slice(0, 10)); // Limit to 10 suggestions like YouTube
        setShowSuggestions(true);
      } else {
        setFilteredOperators([]);
        setShowSuggestions(false);
      }
    }, 150); // Small debounce for smooth typing

    return () => clearTimeout(debounceTimer);
  }, [query, operators]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTargetPage = () => {
    switch (prevpage) {
      case 'lvl2':
        return '/CycleCheckSheet';
      case 'QualityLevel2':
        return '/Level2OjtQualityTable';
      case 'Level 3':
        return '/CycleCheckSheet';
      case 'QualityLevel3':
        return '/Level3OjtQualityTable';
      default:
        return '/level1ojttable';
    }
  };

  const handleNavigation = (operator: OperatorMaster) => {
    const targetPage = getTargetPage();

    console.log('Navigating to:', targetPage, 'with operator:', operator);

    navigate(targetPage, {
      state: {
        operatorId: operator.employee_code,
        employeeName: operator.full_name || 'Unknown Operator',
        operatorData: operator,
        lineId,
        lineName,
        prevpage,
        sectionTitle
      }
    });
  };

  const handleSearch = () => {
    if (selectedOperator) {
      handleNavigation(selectedOperator);
    } else if (query.trim() && filteredOperators.length > 0) {
      // If no specific operator selected, use the first match
      handleNavigation(filteredOperators[0]);
    }
  };

  const handleOperatorSelect = (operator: OperatorMaster) => {
    setSelectedOperator(operator);
    setQuery(operator.full_name || operator.employee_code);
    setShowSuggestions(false);
    // Navigate immediately when operator is selected from dropdown
    setTimeout(() => {
      handleNavigation(operator);
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedOperator(null);

    // If input is cleared, hide suggestions
    if (!value.trim()) {
      setShowSuggestions(false);
      setFilteredOperators([]);
    }
  };

  const handleInputFocus = () => {
    // Show suggestions on focus if there's a query and results
    if (query.trim() && filteredOperators.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedOperator(null);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const startScanner = async () => {
    if (!scannerRef.current) return;

    const scannerId = scannerRef.current.id;
    const html5QrCode = new Html5Qrcode(scannerId);
    qrCodeScannerRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText: string) => {
          stopScanner();
          // Try to find operator by scanned code (employee_code)
          const operator = operators.find(op => op.employee_code === decodedText);

          if (operator) {
            handleNavigation(operator);
          } else {
            // If no operator found, create a mock operator object with the scanned ID
            const mockOperator: OperatorMaster = {
              id: 0,
              sr_no: 0,
              employee_code: decodedText,
              full_name: 'Unknown Operator',
              date_of_join: null,
              employee_pattern_category: '',
              designation: '',
              department: '',
              department_code: ''
            };
            handleNavigation(mockOperator);
          }
        },
        (error: string) => {
          console.warn('QR scan error:', error);
        }
      );
    } catch (err) {
      console.error('Scanner error:', err);
    }
  };

  const stopScanner = () => {
    const scanner = qrCodeScannerRef.current;
    if (scanner) {
      scanner.stop().then(() => {
        scanner.clear();
        qrCodeScannerRef.current = null;
        setShowScanner(false);
      }).catch((error) => {
        console.error('Error stopping scanner:', error);
        qrCodeScannerRef.current = null;
        setShowScanner(false);
      });
    } else {
      setShowScanner(false);
    }
  };

  useEffect(() => {
    if (showScanner) {
      startScanner();
    }

    return () => {
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current.stop().then(() => {
          qrCodeScannerRef.current?.clear();
          qrCodeScannerRef.current = null;
        }).catch((error) => {
          console.error('Error cleaning up scanner:', error);
          qrCodeScannerRef.current = null;
        });
      }
    };
  }, [showScanner]);

  return (
    <>
      <Nav />
      <div className="flex flex-col justify-center items-center h-screen bg-white relative">
        <h1 className="text-3xl font-bold text-[#1c2a4d] mb-6">{lineName}</h1>

        <div className="relative w-[600px]">
          <div className="flex items-center bg-white px-4 py-3 rounded-[15px] shadow-md border transition-all duration-200">
            <Search
              className="text-gray-500 mr-3 cursor-pointer hover:text-blue-500 transition-colors"
              size={20}
              onClick={handleSearch}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by operator name or employee code"
              className="flex-1 outline-none bg-transparent text-gray-800 text-base"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors mr-2"
              >
                <X size={16} />
              </button>
            )}
            <div className="border-l border-gray-300 pl-3 ml-2">
              <button
                onClick={() => setShowScanner(true)}
                className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                title="Scan QR Code"
              >
                <ScanLine size={20} />
              </button>
            </div>
          </div>

          {/* YouTube-style Suggestions Dropdown */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute left-0 right-0 mt-[5px] bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-40"
            >
              {loading ? (
                <div className="p-4 text-center text-gray-500 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  Loading operators...
                </div>
              ) : filteredOperators.length > 0 ? (
                filteredOperators.map((operator, index) => (
                  <div
                    key={`${operator.id}-${index}`}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 group"
                    onClick={() => handleOperatorSelect(operator)}
                  >
                    <Search className="text-gray-400 mr-3 flex-shrink-0" size={16} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {operator.full_name || 'No name available'}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {operator.employee_code} • {operator.department || 'No department'}
                      </div>
                    </div>
                  </div>
                ))
              ) : query.trim() ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="text-sm">No operators found for "{query}"</div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* QR Scanner Modal */}
        {showScanner && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg relative">
              <button
                onClick={stopScanner}
                className="absolute top-1 right-2 text-red-600 font-bold text-lg"
              >
                ✕
              </button>
              <div id="qr-reader" ref={scannerRef} className="w-[300px] h-[300px]" />
              <p className="text-center mt-2 text-sm text-gray-600">Scan a QR code</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBarWithQRScanner;