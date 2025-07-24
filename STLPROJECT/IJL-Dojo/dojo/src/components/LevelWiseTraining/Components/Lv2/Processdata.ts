export interface ProcessData {
  heading: string;
  subheadings: {
    name: string;
    subcontent: string[];
  }[];
}

export const processData: ProcessData[] = [
  {
    heading: "Comp Section",
    subheadings: [
      {
        name: "Washing Machine",
        subcontent: []
      },
      {
        name: "Terminal Pre-setting",
        subcontent: []
      },
      {
        name: "Wire Winding",
        subcontent: []
      },
      {
        name: "Cutting Machine",
        subcontent: []
      },
      {
        name: "Electrodeposition",
        subcontent: []
      },
      {
        name: "Boss Cut",
        subcontent: []
      },
      {
        name: "Resistance",
        subcontent: []
      },
      {
        name: "Final Inspection",
        subcontent: []
      },
      {
        name: "Inj Comp A",
        subcontent: ["Operation", "Final Inspection"]
      },
      {
        name: "Inj Comp B",
        subcontent: ["Operation", "Terminal Height Check", "Final Inspection"]
      },
      {
        name: "Inj Comp C",
        subcontent: ["Operation", "Final Inspection"]
      }
    ]
  },
  {
    heading: "VC Grinding",
    subheadings: [
      {
        name: "Rough Grinding",
        subcontent: []
      },
      {
        name: "Finish Grinding",
        subcontent: []
      },
      {
        name: "Washing (LV-Oil)",
        subcontent: []
      },
      {
        name: "Final Inspection",
        subcontent: []
      },
      {
        name: "Packaging",
        subcontent: []
      }
    ]
  },
  {
    heading: "Fuel Pipe Assembly",
    subheadings: [
      {
        name: "Ring Backup",
        subcontent: []
      },
      {
        name: "Cap Insert",
        subcontent: []
      },
      {
        name: "Child Part Assembly",
        subcontent: []
      },
      {
        name: "Inj Pipe Comp Inspection",
        subcontent: []
      },
      {
        name: "Insert Inserting",
        subcontent: []
      },
      {
        name: "Stay Assembly",
        subcontent: []
      }
    ]
  },
  {
    heading: "Try Assembly",
    subheadings: [
      {
        name: "Operation",
        subcontent: []
      },
      {
        name: "Final Inspection",
        subcontent: []
      },
      {
        name: "Cabani Inspection",
        subcontent: []
      },
      {
        name: "Leak Test",
        subcontent: []
      }
    ]
  },
  {
    heading: "PI",
    subheadings: [
      {
        name: "Process 1",
        subcontent: ["5S Line Patrolling", "Basic Measuring Instrument"]
      },
      {
        name: "Process 2",
        subcontent: ["Contamination Verification", "UTM"]
      },
      {
        name: "Process 3",
        subcontent: ["Cutting Machine", "Polishing Machine"]
      },
      {
        name: "Process 4",
        subcontent: ["Roundness", "Surface", "Contour", "Profile Projector"]
      },
      {
        name: "Process 5",
        subcontent: ["VMM", "Rejection Analysis"]
      }
    ]
  }
];