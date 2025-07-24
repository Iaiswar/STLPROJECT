
import React, { useEffect, useState } from "react";

// --- DisplayMultiSkilling Interface
interface DisplayMultiSkilling {
  id: string;
  employee: string;
  employee_code: string;
  employee_department: string;
  employee_designation: string;
  department: string;
  operation: string;
  operation_min_skill: number;
  level: string;
  skill_level: string;
  date: string;
  notes: string;
  status: string;
}

// --- SVG ICON COMPONENTS ---
const NotificationIcon = () => (
  <svg width="24" height="24" fill="none" stroke="#275080" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M12 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5 18h14M18 7a6 6 0 1 0-12 0v7a2 2 0 0 1-2 2h16a2 2 0 0 1-2-2V7Z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="22" height="22" fill="none" stroke="#356087" strokeWidth="1.6" viewBox="0 0 24 24" style={{ minWidth: 22 }}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-4 0v2" />
    <path d="M3 12h18" />
  </svg>
);

const Calendar = () => (
  <svg width="20" height="20" fill="none" stroke="#1170b8" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="4" y="6" width="16" height="14" rx="2"/>
    <path d="M16 2v4M8 2v4M4 10h16" />
  </svg>
);

const User = () => (
  <svg width="20" height="20" fill="none" stroke="#375273" strokeWidth="1.6" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
  </svg>
);

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

// --- ACCORDION COMPONENT ---
type AccordionProps = {
  children: React.ReactNode;
  open: boolean;
  onClick: () => void;
  header: string;
  unread: boolean;
  date: string;
  role?: string;
};
function Accordion({ children, open, onClick, header, unread, date, role = "" }: AccordionProps) {
  return (
    <div
      className={`mb-5 transition-shadow border 
        ${unread
          ? "bg-gradient-to-r from-blue-50 to-white border-blue-300"
          : "bg-white border-gray-200"}
        rounded-xl shadow hover:shadow-lg duration-100`}
      style={{
        minHeight: 74,
        fontSize: "1.09rem",
        overflow: "hidden",
        borderLeft: unread ? '5px solid #3478b8' : '3px solid #c6d0da'
      }}
      role={role}
    >
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none 
          font-medium ${unread ? "text-[#2a4669]" : "text-[#263847]"}
          transition bg-transparent`}
        type="button"
      >
        <span className="flex items-center gap-2">
          <BriefcaseIcon />
          <span>{header}</span>
        </span>
        <span className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-normal">{date}</span>
          <span
            className={`inline-block ml-2 transform transition-transform ${open ? "rotate-180" : ""}`}
            style={{ fontSize: "1.3em", color: "#87a4c2" }}
          >▼</span>
        </span>
      </button>
      <div className={`overflow-hidden transition-all px-6 ${open ? "max-h-screen pb-6" : "max-h-0 pb-0"}`}>
        {open && <div className="pt-1">{children}</div>}
      </div>
    </div>
  );
}

// --- MAIN NOTIFICATION COMPONENT ---
const MultiNotification: React.FC = () => {
  const [multiSkills, setMultiSkills] = useState<DisplayMultiSkilling[]>([]);
  const [filtered, setFiltered] = useState<DisplayMultiSkilling[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [accordionOpen, setAccordionOpen] = useState<{ [id: string]: boolean }>({});
  const [readIds, setReadIds] = useState<string[]>([]);

  // --- READ IDS ---
  useEffect(() => {
    const storedRead = localStorage.getItem("multiSkillReadIds");
    if (storedRead) setReadIds(JSON.parse(storedRead));
  }, []);

  function markAsRead(id: string) {
    if (!readIds.includes(id)) {
      const newRead = [...readIds, id];
      setReadIds(newRead);
      localStorage.setItem("multiSkillReadIds", JSON.stringify(newRead));
    }
  }

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          multiRes, levelRes, operatorRes, opRes, deptRes
        ] = await Promise.all([
          fetch('http://127.0.0.1:8000/multiskilling/'),
          fetch('http://127.0.0.1:8000/operator-levels/'),
          fetch('http://127.0.0.1:8000/operators-master/'),
          fetch('http://127.0.0.1:8000/operationlist/'),
          fetch('http://127.0.0.1:8000/skill-matrix/')
        ]);
        const [
          multiData, levels, operators, operations, departments
        ] = await Promise.all([
          multiRes.json(),
          levelRes.json(),
          operatorRes.json(),
          opRes.json(),
          deptRes.json(),
        ]);
        const transformed: DisplayMultiSkilling[] = multiData.map((item: any) => {
          const emp = operators.find((e: any) => e.id === item.employee);
          const dept = departments.find((d: any) => d.id === item.department);
          const op = operations.find((o: any) => o.id === item.operation);
          const level = levels.find((l: any) => l.employee === item.employee && l.operation === item.operation);
          return {
            id: String(item.id),
            employee: emp?.full_name || `Employee ${item.employee}`,
            employee_code: emp?.employee_code || '',
            employee_department: emp?.department || '',
            employee_designation: emp?.designation || '',
            department: dept?.department || 'N/A',
            operation: op?.name || 'Unknown Operation',
            operation_min_skill: op?.minimum_skill_required || 0,
            level: level ? `Level ${level.level}` : 'N/A',
            skill_level: item.skill_level || 'N/A',
            date: item.date,
            notes: item.notes || 'No notes provided',
            status: item.status,
          };
        });
        setMultiSkills(
          transformed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
        setLoading(false);
      } catch (err) {
        setError("Error while fetching data");
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // --- FILTERING ---
  useEffect(() => {
    const now = new Date();
    let filteredList = multiSkills;
    if (filter === "day") {
      filteredList = multiSkills.filter(s => {
        const d = new Date(s.date);
        return d.toDateString() === now.toDateString();
      });
    } else if (filter === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      filteredList = multiSkills.filter(s => {
        const d = new Date(s.date);
        return d >= startOfWeek && d <= endOfWeek;
      });
    } else if (filter === "month") {
      const ym = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
      filteredList = multiSkills.filter(s => s.date && s.date.startsWith(ym));
    }
    // Unread skills on top
    filteredList = [
      ...filteredList.filter(ms => !readIds.includes(ms.id)),
      ...filteredList.filter(ms => readIds.includes(ms.id)),
    ];
    setFiltered(filteredList);
  }, [filter, multiSkills, readIds]);

  function formatDate(date: string) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "scheduled":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "inprogress":
      case "in progress":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "rescheduled":
        return "bg-orange-50 text-orange-800 border-orange-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  }

  const SkillDetail: React.FC<{ skill: DisplayMultiSkilling }> = ({ skill }) => (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <User />
        <span className="font-semibold text-[#294461]">{skill.employee}</span>
        <span className="text-xs text-gray-400">({skill.employee_code})</span>
      </div>
      <p className="text-sm text-gray-600 mt-1 mb-2">
        Department: {skill.department}
      </p>
      <div className="flex items-center gap-3 mb-2">
        <BriefcaseIcon />
        <span className="text-[#294461] font-medium" style={{ minWidth: "120px" }}>
          Current Level:
        </span>
        <span className="font-semibold text-gray-800">{skill.level}</span>
      </div>
      <div className="flex items-center mb-2">
        <Calendar />
        <span className="ml-2">{formatDate(skill.date)}</span>
      </div>
      <div className="mb-3 p-3 text-base rounded-lg bg-gray-50 border border-gray-200">{skill.notes}</div>
      <div
        className={`px-4 py-2 inline-block rounded-lg font-semibold text-xs border ${getStatusColor(
          skill.status
        )} shadow`}
      >
        {skill.status.replace("inprogress", "in progress")}
      </div>
    </div>
  );

  // -- RECENT LOGIC ---
  const unreadSkills = multiSkills.filter(ms => !readIds.includes(ms.id));
  const recentSkill = unreadSkills.length > 0 ? unreadSkills[0] : null;

  // --- RENDER ---
  if (loading)
    return (<div className="w-full p-10 text-center text-lg font-sans">Loading...</div>);
  if (error)
    return (
      <div className="w-full text-center text-red-600 p-6 font-sans">
        {error}
      </div>
    );
  if (filtered.length === 0)
    return (
      <div className="w-full min-h-screen bg-[#f7f9fb] font-sans">
        <div className="max-w-full px-2 sm:px-5 pt-9 pb-5 mx-auto">
          <h2 className="text-[2.18rem] font-bold ml-3 tracking-tight text-[#23334c] flex items-center"> <NotificationIcon /> MultiSkilling Notifications</h2>
          <div className="text-center text-gray-400 py-20 text-base font-medium">
            No notifications to show.
          </div>
        </div>
      </div>
    );

  return (
    <div
      className="w-full min-h-screen bg-[#f7f9fb] font-sans"
      style={{ fontFamily: `"Segoe UI",Arial,sans-serif` }}
    >
      <div className="max-w-full px-2 sm:px-5 pt-9 pb-5 mx-auto">
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <span>
              <NotificationIcon />
            </span>
            <h2 className="text-[2.18rem] font-bold ml-3 tracking-tight text-[#23334c]">
              MultiSkilling Notifications
            </h2>
          </div>
          <div className="flex items-center">
            <label
              className="mr-3 font-medium text-[#294461] text-base"
              htmlFor="notif-filter"
            >
              Filter:
            </label>
            <select
              id="notif-filter"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="block w-40 px-3 py-2 border border-blue-200 text-[#23436a] bg-white 
                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 font-medium text-base"
            >
              {FILTER_OPTIONS.map(f => (
                <option value={f.value} key={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recently Added Notification */}
        {recentSkill && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-5 mb-8 flex justify-between items-center shadow">
            <div className="flex items-center gap-2 text-lg font-semibold text-green-800">
              <NotificationIcon />
              <span>1 skill added recently</span>
            </div>
            <button
              className="ml-4 text-green-900 px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 font-semibold transition"
              onClick={() => {
                markAsRead(recentSkill.id);
              }}
            >
              Mark as read
            </button>
          </div>
        )}

        {/* Accordions */}
        <div>
          {filtered.map(skill => {
            const open = accordionOpen[skill.id] || false;
            const unread = !readIds.includes(skill.id);
            return (
              <Accordion
                key={skill.id}
                open={open}
                header={skill.operation}
                date={formatDate(skill.date)}
                onClick={() => {
                  setAccordionOpen({
                    ...accordionOpen,
                    [skill.id]: !open,
                  });
                  if (!readIds.includes(skill.id)) markAsRead(skill.id);
                }}
                unread={unread}
                role="region"
              >
                <SkillDetail skill={skill} />
              </Accordion>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultiNotification;
