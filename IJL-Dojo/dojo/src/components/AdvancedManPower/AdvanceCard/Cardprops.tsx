import React, { useState, useEffect } from "react";

interface Subtopic {
  dataKey: string;
  displayText: string;
}

interface CardProps {
  subtopics: Subtopic[];
  getUrl: string;
  cardColors: string[];
}

interface ApiResponse {
  current_month?: Array<{
    [key: string]: any;
  }>;
  operator_trend?: Array<{
    [key: string]: any;
  }>;
  buffer_trend?: Array<{
    [key: string]: any;
  }>;
  absentee_trend?: Array<{
    [key: string]: any;
  }>;
  attrition_trend?: Array<{
    [key: string]: any;
  }>;
}

const CardProps: React.FC<CardProps> = ({ subtopics, getUrl, cardColors }) => {
  const [data, setData] = useState<Record<string, number>>({});
  const [apiData, setApiData] = useState<ApiResponse>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!getUrl) return;

        const response = await fetch(getUrl);
        const result: ApiResponse = await response.json();
        setApiData(result);

        if (result.current_month && result.current_month.length > 0) {
          setData(result.current_month[0]);
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchData();
  }, [getUrl]);

  const getValue = (dataKey: string): number => {
    if (data[dataKey] !== undefined) {
      return data[dataKey] ?? 0;
    }
    if (dataKey.includes('operator')) {
      return apiData.operator_trend?.[0]?.[dataKey] ?? 0;
    }
    if (dataKey.includes('buffer')) {
      return apiData.buffer_trend?.[0]?.[dataKey] ?? 0;
    }
    if (dataKey.includes('absentee')) {
      return apiData.absentee_trend?.[0]?.[dataKey] ?? 0;
    }
    if (dataKey.includes('attrition')) {
      return apiData.attrition_trend?.[0]?.[dataKey] ?? 0;
    }
    return 0;
  };

  const getCardColor = (dataKey: string, index: number): string => {
    if (dataKey === "operator_availability_ctq" || dataKey === "operator_required_ctq") {
      const available = getValue("operator_availability_ctq");
      const required = getValue("operator_required_ctq");
      
      if (available === required) return "#12c53b";
      if (available > required) return "#948dffff";
      if (available / required >= 0.95) return "#e6e603";
      return "#ee583e";
    }
    
    if (dataKey === "buffer_manpower_availability_ctq" || dataKey === "buffer_manpower_required_ctq") {
      const available = getValue("buffer_manpower_availability_ctq");
      const required = getValue("buffer_manpower_required_ctq");
      
      if (available === required) return "#12c53b";
      if (available > required) return "#948dffff";
      if (available / required >= 0.95) return "#e6e603";
      return "#ee583e";
    }
    
    return cardColors[index] || "#4CAF50";
  };

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {subtopics.map((subtopic, index) => {
          const value = getValue(subtopic.dataKey);
          const backgroundColor = getCardColor(subtopic.dataKey, index);

          return (
            <div
              key={subtopic.dataKey}
              className="w-full aspect-[4/3] =rounded-lg shadow-md flex flex-col justify-center items-center text-white p-2"
              style={{ backgroundColor }}
            >
              <span className="text-2xl md:text-3xl font-bold">{value}</span>
              <span className="text-xs sm:text-sm mt-1 text-center">{subtopic.displayText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardProps;