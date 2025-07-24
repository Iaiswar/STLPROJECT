import React, { useEffect, useState } from "react";
import { Download, FileText, Loader2, AlertCircle, Package } from "lucide-react";

interface FileItem {
    id: number;
    title: string;
    file: string; // This will be the URL to the file
    uploaded_at: string;
}

const DownloadFiles: React.FC = () => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingAll, setDownloadingAll] = useState(false);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/download-all/")
            .then((res) => res.json())
            .then((data) => {
                setFiles(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch files:", error);
                setLoading(false);
            });
    }, []);

    const handleDownload = (fileId: number, fileName: string) => {
        window.open(`http://127.0.0.1:8000/download-file/${fileId}/`, '_blank');
    };

    const handleDownloadAll = async () => {
        setDownloadingAll(true);
        // Add a small delay between downloads to prevent overwhelming the browser
        for (const file of files) {
            handleDownload(file.id, file.title);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        setDownloadingAll(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Loading files...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <Package className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Tool</h1>
                    <p className="text-gray-600">Please download the exam tool to continue the exam</p>
                </div>

                {/* Instructions Card */}
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>
                    
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-white text-lg">Exam Tool Setup</h2>
                                <p className="text-indigo-100 text-sm">Follow these steps to install and run the exam tool</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative p-6">
                        <div className="grid gap-4">
                            <div className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 border border-indigo-100">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">1</div>
                                <div className="flex-1">
                                    <p className="text-gray-700 font-medium">Download & Extract</p>
                                    <p className="text-gray-600 text-sm mt-1">Unzip the downloaded <strong>client_program</strong> files to your desired location.</p>
                                </div>
                            </div>
                            
                            <div className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-100">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">2</div>
                                <div className="flex-1">
                                    <p className="text-gray-700 font-medium">Get Run Test File</p>
                                    <p className="text-gray-600 text-sm mt-1">Download the <strong>Run_test</strong> file from the available files below.</p>
                                </div>
                            </div>
                            
                            <div className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl hover:from-pink-100 hover:to-red-100 transition-all duration-200 border border-pink-100">
                                <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">3</div>
                                <div className="flex-1">
                                    <p className="text-gray-700 font-medium">Launch Exam Tool</p>
                                    <p className="text-gray-600 text-sm mt-1">Double-click on <strong>Run_test</strong> to start the exam application.</p>
                                </div>
                            </div>
                            
                            <div className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:from-red-100 hover:to-orange-100 transition-all duration-200 border border-red-100">
                                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">4</div>
                                <div className="flex-1">
                                    <p className="text-gray-700 font-medium">Minimize Terminal</p>
                                    <p className="text-gray-600 text-sm mt-1">When the terminal window appears, <strong>minimize it</strong> and proceed with your exam.</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Bottom Note */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <p className="text-blue-700 text-sm font-medium">Important: Keep the terminal minimized during your exam session</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Files Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h3 className="text-white font-semibold text-lg flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Available Files ({files.length})
                        </h3>
                    </div>
                    
                    <div className="p-6">
                        {files.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No files available at the moment.</p>
                                <p className="text-gray-400 text-sm mt-2">Check back later for updates.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-6">
                                    {files.map((file, index) => (
                                        <div
                                            key={file.id}
                                            className="group flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                                        >
                                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 truncate">{file.title}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        Uploaded: {formatDate(file.uploaded_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownload(file.id, file.title)}
                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                <Download className="h-4 w-4" />
                                                <span>Download</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Download All Button */}
                                <div className="border-t pt-6">
                                    <div className="text-center">
                                        <button
                                            onClick={handleDownloadAll}
                                            disabled={downloadingAll}
                                            className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
                                        >
                                            {downloadingAll ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Download className="h-5 w-5" />
                                            )}
                                            <span className="font-medium">
                                                {downloadingAll ? 'Downloading...' : 'Download All Files'}
                                            </span>
                                        </button>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Download all {files.length} files at once
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadFiles;