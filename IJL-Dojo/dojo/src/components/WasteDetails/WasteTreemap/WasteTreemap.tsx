export default function TopItemsByWaste() {
    return (
      <div className="bg-white p-4 rounded-lg  shadow-2xl w-full ">
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">Top Items by Waste(%)</h2>
  
        {/* Main Container */}
        <div className="flex ">
  
          {/* First Row - 3 Boxes */}
          <div className="flex flex-col flex-1">
            <Item label="JH" color="bg-orange-400" height="h-[100px]" /> {/* Custom height for JH */}
            <Item label="EO" color="bg-purple-400" height="h-[100px]" /> {/* Custom height for EO */}
            <Item label="DT" color="bg-sky-400" height="h-[100px]" /> {/* Custom height for DT */}
          </div>
  
          {/* Second Row - 3 Boxes */}
          <div className="flex flex-col flex-1">
            <Item label="FM" color="bg-red-400" height="h-[90px]" />
            <Item label="BH" color="bg-gray-500" height="h-[90px]" />
            <Item label="FH" color="bg-blue-600" height="h-[120px]" />
          </div>
  
          {/* Third Row - 5 Boxes */}
          <div className="flex flex-col flex-1">
            {/* First small div - 2 boxes */}
            <div className="flex flex-1 w-full">
              <Item label="OM" color="bg-pink-400" height="h-[180px]" />
              <Item label="WQ" color="bg-green-400" height="h-[180px]" />
            </div>
  
            {/* Second small div - 3 boxes */}
            <div className="flex flex-col flex-1">
              <Item label="LO" color="bg-cyan-500" height="h-[60px]" />
              <Item label="RG" color="bg-pink-300" height="h-[60px]" />
            </div>
          </div>
  
        </div>
      </div>
    );
  }
  
  // Small Box Component with custom height in px
  function Item({ label, color, height }: { label: string; color: string; height: string }) {
    return (
      <div className={`${height} pl-2 text-white font-bold text-xl w-full   ${color}`}>
        {label}
      </div>
    );
  }
  