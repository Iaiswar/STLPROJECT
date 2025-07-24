import { useState, useEffect, MouseEvent, KeyboardEvent, ChangeEvent, JSX } from 'react';
import { Trash2, Plus, Grid, Columns, Rows, Merge } from 'lucide-react';

// Define types for our state and props
interface CellStyle {
  backgroundColor?: string;
  border?: string;
  position?: string;
  [key: string]: string | undefined;
}

interface CellContent {
  [key: string]: string;
}

interface MergedCellGroup {
  id: string;
  cells: string[];
}

export default function CustomizableTable(): JSX.Element {
  const [rowCount, setRowCount] = useState<number>(4);
  const [colCount, setColCount] = useState<number>(6);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [mergedCellGroups, setMergedCellGroups] = useState<MergedCellGroup[]>([]);
  const [cellStyles, setCellStyles] = useState<Record<string, CellStyle>>({});
  const [cellContents, setCellContents] = useState<CellContent>({});
  const [headerRowCount, setHeaderRowCount] = useState<number>(1);
  const [headerColCount, setHeaderColCount] = useState<number>(1);
  const [editing, setEditing] = useState<string | null>(null);
  
  // Clear selection when row/col counts change
  useEffect(() => {
    setSelectedCells([]);
  }, [rowCount, colCount]);
  
  // Get cell key from row and col
  const getCellKey = (row: number, col: number): string => `${row}-${col}`;
  
  // Check if a cell is part of a merged group
  const getMergedGroupForCell = (row: number, col: number): MergedCellGroup | undefined => {
    const cellKey = getCellKey(row, col);
    return mergedCellGroups.find(group => 
      group.cells.includes(cellKey)
    );
  };
  
  // Check if cell is the main cell of a merged group
  const isMainCellOfGroup = (row: number, col: number): boolean => {
    const group = getMergedGroupForCell(row, col);
    return Boolean(group && group.cells[0] === getCellKey(row, col));
  };
  
  // Check if cell should be rendered (not a secondary cell in a merged group)
  const shouldRenderCell = (row: number, col: number): boolean => {
    const group = getMergedGroupForCell(row, col);
    if (!group) return true;
    return group.cells[0] === getCellKey(row, col);
  };
  
  // Calculate colspan and rowspan for merged cells
  const getCellSpans = (row: number, col: number): { rowSpan: number; colSpan: number } => {
    const group = getMergedGroupForCell(row, col);
    if (!group || group.cells[0] !== getCellKey(row, col)) {
      return { colSpan: 1, rowSpan: 1 };
    }
    
    const rows = new Set<number>();
    const cols = new Set<number>();
    
    group.cells.forEach(cell => {
      const [r, c] = cell.split('-').map(Number);
      rows.add(r);
      cols.add(c);
    });
    
    return {
      rowSpan: rows.size,
      colSpan: cols.size
    };
  };
  
  // Handle cell click for selection
  const handleCellClick = (row: number, col: number, event: MouseEvent<HTMLTableCellElement>): void => {
    if (editing) return;
    
    const cellKey = getCellKey(row, col);
    
    // Check if this cell is part of a merged group
    const group = getMergedGroupForCell(row, col);
    
    if (event.shiftKey && selectedCells.length > 0) {
      // Range selection with shift key
      const firstCell = selectedCells[0].split('-').map(Number);
      const startRow = Math.min(firstCell[0], row);
      const endRow = Math.max(firstCell[0], row);
      const startCol = Math.min(firstCell[1], col);
      const endCol = Math.max(firstCell[1], col);
      
      const newSelection: string[] = [];
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          newSelection.push(getCellKey(r, c));
        }
      }
      setSelectedCells(newSelection);
    } else if (event.ctrlKey || event.metaKey) {
      // Add/remove with ctrl/cmd key
      if (group) {
        // If part of a group, select/deselect the whole group
        if (selectedCells.some(cell => group.cells.includes(cell))) {
          setSelectedCells(selectedCells.filter(cell => !group.cells.includes(cell)));
        } else {
          setSelectedCells([...selectedCells, ...group.cells]);
        }
      } else {
        if (selectedCells.includes(cellKey)) {
          setSelectedCells(selectedCells.filter(cell => cell !== cellKey));
        } else {
          setSelectedCells([...selectedCells, cellKey]);
        }
      }
    } else {
      // Normal click selects only this cell or group
      if (group) {
        setSelectedCells(group.cells);
      } else {
        setSelectedCells([cellKey]);
      }
    }
  };
  
  // Handle double click for editing
  const handleDoubleClick = (row: number, col: number): void => {
    if (isMainCellOfGroup(row, col) || !getMergedGroupForCell(row, col)) {
      setEditing(getCellKey(row, col));
    }
  };
  
  // Handle cell content change
  const handleContentChange = (row: number, col: number, value: string): void => {
    setCellContents(prev => ({
      ...prev,
      [getCellKey(row, col)]: value
    }));
  };
  
  // Merge selected cells
  const mergeCells = (): void => {
    if (selectedCells.length <= 1) return;
    
    // Check if cells form a rectangle
    const rows = new Set<number>();
    const cols = new Set<number>();
    
    selectedCells.forEach(cell => {
      const [row, col] = cell.split('-').map(Number);
      rows.add(row);
      cols.add(col);
    });
    
    const rowArr = [...rows].sort((a: number, b: number) => a - b);
    const colArr = [...cols].sort((a: number, b: number) => a - b);
    
    // Check if cells form a contiguous rectangle
    const expectedCellCount = rowArr.length * colArr.length;
    if (selectedCells.length !== expectedCellCount) {
      alert("Selected cells must form a rectangle to merge");
      return;
    }
    
    // Remove any cells that are part of existing merged groups
    const cellsToMerge = selectedCells.filter(cell => {
      const [row, col] = cell.split('-').map(Number);
      return !getMergedGroupForCell(row, col);
    });
    
    if (cellsToMerge.length <= 1) {
      alert("Selected cells are already part of merged groups");
      return;
    }
    
    // Create a new merged group
    const newGroup: MergedCellGroup = {
      id: Date.now().toString(),
      cells: cellsToMerge
    };
    
    setMergedCellGroups([...mergedCellGroups, newGroup]);
    setSelectedCells([]);
  };
  
  // Unmerge selected cells
  const unmergeCells = (): void => {
    if (selectedCells.length === 0) return;
    
    // Find merged groups containing selected cells
    const groupsToRemove = mergedCellGroups.filter(group => 
      group.cells.some(cell => selectedCells.includes(cell))
    );
    
    if (groupsToRemove.length === 0) return;
    
    // Remove these groups
    setMergedCellGroups(mergedCellGroups.filter(group => 
      !groupsToRemove.includes(group)
    ));
    
    setSelectedCells([]);
  };

  // Generate cell styles including borders and backgrounds
  const getCellStyle = (row: number, col: number): CellStyle => {
    const isHeader = row < headerRowCount || col < headerColCount;
    const cellKey = getCellKey(row, col);
    const isSelected = selectedCells.includes(cellKey);
    
    return {
      backgroundColor: isHeader ? 'bg-gray-200' : isSelected ? 'bg-blue-100' : 'bg-white',
      border: 'border border-gray-300',
      position: 'relative',
      ...(cellStyles[cellKey] || {})
    };
  };

  // Generate table rows and cells
  const renderTable = (): JSX.Element[] => {
    const rows: JSX.Element[] = [];
    
    for (let row = 0; row < rowCount; row++) {
      const cells: JSX.Element[] = [];
      
      for (let col = 0; col < colCount; col++) {
        const cellKey = getCellKey(row, col);
        
        if (!shouldRenderCell(row, col)) continue;
        
        const { rowSpan, colSpan } = getCellSpans(row, col);
        const isEditing = editing === cellKey;
        const content = cellContents[cellKey] || '';
        
        cells.push(
          <td 
            key={cellKey}
            className={`${getCellStyle(row, col).backgroundColor} ${getCellStyle(row, col).border} p-2 min-w-16 text-center`}
            onClick={(e) => handleCellClick(row, col, e)}
            onDoubleClick={() => handleDoubleClick(row, col)}
            colSpan={colSpan}
            rowSpan={rowSpan}
          >
            {isEditing ? (
              <input
                className="w-full p-1 border border-blue-500 focus:outline-none"
                value={content}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleContentChange(row, col, e.target.value)}
                onBlur={() => setEditing(null)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && setEditing(null)}
                autoFocus
              />
            ) : (
              content
            )}
          </td>
        );
      }
      
      rows.push(<tr key={row}>{cells}</tr>);
    }
    
    return rows;
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-xl font-bold">Customizable Table Builder</h1>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="font-medium">Rows:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={rowCount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRowCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 border border-gray-300 rounded px-2 py-1"
            />
            <Rows size={16} className="text-gray-600" />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="font-medium">Columns:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={colCount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setColCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 border border-gray-300 rounded px-2 py-1"
            />
            <Columns size={16} className="text-gray-600" />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="font-medium">Header Rows:</label>
            <input
              type="number"
              min="0"
              max={rowCount}
              value={headerRowCount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setHeaderRowCount(Math.min(rowCount, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-16 border border-gray-300 rounded px-2 py-1"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="font-medium">Header Columns:</label>
            <input
              type="number"
              min="0"
              max={colCount}
              value={headerColCount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setHeaderColCount(Math.min(colCount, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-16 border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={mergeCells}
            disabled={selectedCells.length <= 1}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            <Merge size={16} />
            Merge Cells
          </button>
          
          <button
            onClick={unmergeCells}
            disabled={selectedCells.length === 0}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            <Grid size={16} />
            Unmerge Cells
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p><strong>Tips:</strong> Double-click to edit cell content. Hold Shift to select a range. Hold Ctrl/Cmd to select multiple cells.</p>
        </div>
      </div>
      
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full table-fixed border-collapse">
          <tbody>
            {renderTable()}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Selected cells:</h3>
        <p>{selectedCells.length > 0 ? selectedCells.join(", ") : "None"}</p>
      </div>
    </div>
  );
}

// import React from 'react';

// const ObservationForm: React.FC = () => {
//   return (
//     <div className="w-full overflow-x-auto">
//       <table className="w-full border-collapse text-sm">
//         <thead>
//           {/* Top Header Row */}
//           <tr>
//             <th className="border border-gray-400 p-2 bg-blue-100 text-center font-semibold">New Joinee Operator Name</th>
//             <th className="border border-gray-400 p-2 bg-blue-100 text-center font-semibold">E.Code</th>
//             <th className="border border-gray-400 p-2 bg-blue-100 text-center font-semibold">Department</th>
//             <th className="border border-gray-400 p-2 bg-blue-100 text-center font-semibold">Date of Joining in DOJO</th>
//             {/* Evaluation Criteria Title across 2 columns */}
//             <th className="border border-gray-400 p-2 bg-blue-100 text-center font-semibold" colSpan={2}>
//               Evaluation Criteria:
//             </th>
//             {/* Marking Criteria Title across 2 columns */}
//             <th className="border border-gray-400 p-2 bg-blue-100 text-center font-semibold" colSpan={2}>
//               Marking Criteria:
//             </th>
//           </tr>

//           {/* Second Row with Pass, Fail, 0/1/2 Marking */}
//           <tr>
//             <th className="border border-gray-400 p-2 bg-gray-50" rowSpan={3}></th>
//             <th className="border border-gray-400 p-2 bg-gray-50" rowSpan={3}></th>
//             <th className="border border-gray-400 p-2 bg-gray-50" rowSpan={3}></th>
//             <th className="border border-gray-400 p-2 bg-gray-50" rowSpan={3}></th>

//             {/* Pass */}
//             <td className="border border-gray-400 p-2 bg-orange-100 text-center" rowSpan={3}>
//               <p className="font-semibold">Pass -</p>
//               <p className="text-xs leading-tight">
//                 More than 60%<br />
//                 & 100% marks in Quality<br />
//                 & SOP adherence points<br />
//                 in last 3 days
//               </p>
//             </td>

//             {/* Fail */}
//             <td className="border border-gray-400 p-2 bg-orange-100 text-center" rowSpan={3}>
//               <p className="font-semibold">Fail -</p>
//               <p className="text-xs leading-tight">
//                 Less than 60%<br />
//                 or Less than 100% marks in Quality<br />
//                 & SOP adherence points<br />
//                 in last 3 days
//               </p>
//             </td>

//             {/* Marking 0 */}
//             <td className="border border-gray-400 p-2 bg-gray-50 text-center font-semibold w-12">0</td>
//             <td className="border border-gray-400 p-2 bg-gray-50 text-center text-xs">
//               Not Following standard
//             </td>
//           </tr>

//           {/* Marking 1 */}
//           <tr>
//             <td className="border border-gray-400 p-2 bg-gray-50 text-center font-semibold">1</td>
//             <td className="border border-gray-400 p-2 bg-gray-50 text-center text-xs">
//               Following standard Partially<br />
//               <span className="italic text-[10px]">(Not applicable for C.T evaluation & Desired/Actual production)</span>
//             </td>
//           </tr>

//           {/* Marking 2 */}
//           <tr>
//             <td className="border border-gray-400 p-2 bg-gray-50 text-center font-semibold">2</td>
//             <td className="border border-gray-400 p-2 bg-gray-50 text-center text-xs">
//               Following standard Properly
//             </td>
//           </tr>
//         </thead>

//         <tbody>
//           {/* Data rows */}
//           <tr>
//             <td className="border border-gray-300 p-2"></td>
//             <td className="border border-gray-300 p-2"></td>
//             <td className="border border-gray-300 p-2"></td>
//             <td className="border border-gray-300 p-2"></td>
//             <td className="border border-gray-300 p-2"></td>
//             <td className="border border-gray-300 p-2"></td>
//             <td className="border border-gray-300 p-2"></td>
//             <td className="border border-gray-300 p-2"></td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ObservationForm;