// tileData.ts
import {
  BarChart3, Camera, Sword, Users, Grid, RotateCw, Bell, Calendar,
  Book, Glasses, FlaskConical, Settings, FileText, Home, Activity,
  FileBarChart2, UserCog, PlusCircle, Eye, AlertCircle, Clock,
  Layers, Video, FlaskRound, Sliders, FileSearch
} from 'lucide-react';

export const tiles = [
  {
    title: 'Dashboard',
    links: [
      { name: 'Management Review Dashboard', path: '/management', icon: Home },
      // { name: 'Advanced Manpower', path: '/advanced', icon: Activity },
      { name: 'Advance Manpower Planning', path: '/advance', icon: Activity },
    ],
    icon: BarChart3,
    statusText: 'Live',
    borderTopColor: 'border-t-blue-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-blue-600',
  },
  {
    title: 'Snapshots',
    links: [
      { name: 'Monthly', path: '', icon: FileBarChart2 },
      { name: 'Annual', path: '', icon: FileBarChart2 },
    ],
    icon: Camera,
    statusText: 'Updated',
    borderTopColor: 'border-t-purple-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-purple-600',
  },
  {
    title: 'Process Dojo',
    links: [
      { name: 'Process Dojo', path: '/level-training', icon: UserCog },
      { name: 'Quiz Results', path: '/quiz-results', icon: FileBarChart2 },

    ],
    icon: Sword,
    statusText: 'Active',
    borderTopColor: 'border-t-blue-900',
    iconColor: 'text-white',
    iconBgColor: 'bg-blue-900',
  },
  {
    title: 'Master Employee',
    links: [
      { name: 'Master Table', path: '/MasterTable', icon: Users },
      // { name: 'Upload Master Table', path: '/uploadMasterTable', icon: Users },
      { name: 'Employee History', path: '/EmployeeHistorySearch', icon: Users },
    ],
    icon: Users,
    statusText: 'Live',
    borderTopColor: 'border-t-yellow-600',
    iconColor: 'text-white',
    iconBgColor: 'bg-yellow-600',
  },
  {
    title: 'Skill Matrix',
    links: [
      { name: 'Skill Matrix', path: '/skillmatrix', icon: Eye },
    ],
    icon: Grid,
    statusText: 'Beta',
    borderTopColor: 'border-t-purple-800',
    iconColor: 'text-white',
    iconBgColor: 'bg-purple-800',
  },
  {
    title: 'Observance Sheet',
    links: [
      // { name: '10 Cycle', path: '/tencycle', icon: AlertCircle },
      { name: 'Retraining', path: '', icon: RotateCw },

    ],
    icon: RotateCw,
    statusText: 'Active',
    borderTopColor: 'border-t-black',
    iconColor: 'text-white',
    iconBgColor: 'bg-black',
  },
  {
    title: 'Notifications',
    links: [
      { name: 'Notification', path: '/notification', icon: Bell },
      { name: 'Approval List', path: '/approvallist', icon: Bell },
    ],
    icon: Bell,
    statusText: 'Live',
    borderTopColor: 'border-t-green-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-green-500',
  },
  {
    title: 'Schedules',
    links: [
      { name: 'Multiskilling', path: '/scheduling', icon: Clock },
      { name: 'Refresher Training', path: '/refreshment', icon: Calendar },

    ],
    icon: Calendar,
    statusText: 'Updated',
    borderTopColor: 'border-t-yellow-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-yellow-500',
  },
  {
    title: 'Levelwise Curriculum',
    links: [
      { name: 'Levelwise Curriculum', path: '/dojoTraining  ', icon: Layers },
    ],
    icon: Book,
    statusText: 'Active',
    borderTopColor: 'border-t-blue-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-blue-600',
  },
  {
    title: 'AR/VR',
    links: [
      { name: 'AR/VR', path: '/ArVrComponent', icon: Glasses },
    ],
    icon: Glasses,
    statusText: 'New',
    borderTopColor: 'border-t-purple-500',
    iconColor: 'text-white',
    iconBgColor: 'bg-purple-600',
  },
  {
    title: 'Method',
    links: [
      { name: 'Method', path: '/methodsettings', icon: FlaskRound },
    ],
    icon: FlaskConical,
    statusText: 'Updated',
    borderTopColor: 'border-t-blue-900',
    iconColor: 'text-white',
    iconBgColor: 'bg-blue-900',
  },
  {
    title: 'Settings',
    links: [
      { name: 'List', path: '/home', icon: Sliders },
      { name: 'Roles', path: '/home', icon: UserCog },
    ],
    icon: Settings,
    statusText: 'System',
    borderTopColor: 'border-t-yellow-600',
    iconColor: 'text-white',
    iconBgColor: 'bg-yellow-600',
  },
  {
    title: 'Reports',
    links: [
      { name: 'Report', path: '/report', icon: FileSearch },
    ],
    icon: FileText,
    statusText: 'Updated',
    borderTopColor: 'border-t-blue-600',
    iconColor: 'text-white',
    iconBgColor: 'bg-blue-600',
  },




  {
    title: 'Machine Allocation',
    links: [
      { name: 'Machine Allocation', path: '/machine-allocations', icon: FileText },
      { name: 'Machines', path: '/machines', icon: FileSearch },
    ],
    icon: FileText,
    statusText: 'Updated',
    borderTopColor: 'border-t-purple-600',
    iconColor: 'text-white',
    iconBgColor: 'bg-purple-600',
  },

  {
    title: 'Exam Tool',
    links: [
      // { name: 'Exam Tool', path: '/machine-allocations', icon: FileText },
      { name: 'Exam Tool Download', path: '/DownloadFiles', icon: FileSearch },
    ],
    icon: FileText,
    statusText: 'Updated',
    borderTopColor: 'border-t-green-600',
    iconColor: 'text-white',
    iconBgColor: 'bg-green-600',
  },
];