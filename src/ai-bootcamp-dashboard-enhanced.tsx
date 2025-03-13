import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Sector, PieProps
} from 'recharts';
import { Student, Tool, Workshop, Challenge, SortConfig, CategoryData } from './types';
import { students, tools, workshops, challenges } from './data/bootcampData';

// Constants
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F'];
const PASTEL_COLORS = [
  'bg-pink-200 dark:bg-pink-300',
  'bg-blue-200 dark:bg-blue-300',
  'bg-green-200 dark:bg-green-300',
  'bg-purple-200 dark:bg-purple-300',
  'bg-yellow-200 dark:bg-yellow-300',
  'bg-indigo-200 dark:bg-indigo-300',
  'bg-red-200 dark:bg-red-300',
  'bg-teal-200 dark:bg-teal-300',
  'bg-orange-200 dark:bg-orange-300',
  'bg-cyan-200 dark:bg-cyan-300',
];
const THEME = {
  light: {
    background: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-900',
    subtext: 'text-gray-500',
    border: 'border-gray-200',
    highlight: 'bg-indigo-600',
    highlightHover: 'hover:bg-indigo-500',
    sidebar: 'bg-white',
    sidebarHover: 'hover:bg-gray-100'
  },
  dark: {
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    subtext: 'text-gray-400',
    border: 'border-gray-700',
    highlight: 'bg-indigo-500',
    highlightHover: 'hover:bg-indigo-400',
    sidebar: 'bg-gray-800',
    sidebarHover: 'hover:bg-gray-700'
  }
};

// Sidebar Component
const Sidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode,
  viewDensity,
  setViewDensity,
  theme 
}: { 
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  viewDensity: 'compact' | 'comfortable';
  setViewDensity: (value: 'compact' | 'comfortable') => void;
  theme: typeof THEME.light | typeof THEME.dark;
}) => {
  return (
    <div 
      className={`${theme.sidebar} border-r ${theme.border} transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'} fixed h-full left-0 top-0 z-30`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        {!isCollapsed && <span className={`font-semibold ${theme.text}`}>Dashboard</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-md ${theme.card} ${theme.border} ${theme.text}`}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="p-4 space-y-2">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'students', label: 'Students', icon: '👥' },
          { id: 'tools', label: 'AI Tools', icon: '🛠' },
          { id: 'challenges', label: 'Challenges', icon: '🎯' },
          { id: 'workshops', label: 'Workshops', icon: '📚' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center p-2 rounded-md transition-colors
              ${activeTab === item.id 
                ? `${theme.highlight} text-white` 
                : `${theme.text} ${theme.sidebarHover}`}
              ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="ml-3">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${theme.border}`}>
        {!isCollapsed && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`${theme.text} text-sm`}>Theme</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-2 rounded-md ${theme.card} ${theme.border} transition-colors 
                  ${darkMode 
                    ? 'hover:bg-gray-700/50 hover:border-gray-600' 
                    : 'hover:bg-gray-100'
                  } 
                  flex items-center gap-2 group`}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <span className="text-base">{darkMode ? '🌞' : '🌙'}</span>
                <span className={`text-sm ${theme.text} ${darkMode ? 'group-hover:text-gray-200' : 'group-hover:text-gray-900'}`}>
                  {darkMode ? 'Light' : 'Dark'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Buy Me a Coffee Button */}
        <a
          href="https://ko-fi.com/azizkhilawala"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 w-full flex items-center justify-center p-2 rounded-md transition-colors
            bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black font-medium
            ${isCollapsed ? 'px-2' : 'px-4'}`}
        >
          {isCollapsed ? (
            <span className="text-xl">☕</span>
          ) : (
            <>
              <span className="text-xl mr-2">☕</span>
              <span>Buy Me a Ko-Fi</span>
            </>
          )}
        </a>
      </div>
    </div>
  );
};

const getAvatarColor = (name: string) => {
  // Get a consistent index based on the name
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PASTEL_COLORS[index % PASTEL_COLORS.length];
};

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewDensity, setViewDensity] = useState<'compact' | 'comfortable'>('comfortable');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showStudentsOverview, setShowStudentsOverview] = useState(false);
  const [showToolsOverview, setShowToolsOverview] = useState(false);
  const [showChallengesOverview, setShowChallengesOverview] = useState(false);
  const [showWorkshopsOverview, setShowWorkshopsOverview] = useState(false);

  const theme = darkMode ? THEME.dark : THEME.light;

  // Apply dark mode
  useEffect(() => {
    document.body.className = theme.background;
  }, [darkMode]);

  // Sorting function
  const sortData = (data: any[], key: string | null) => {
    if (!key) return data;

    return [...data].sort((a, b) => {
      if (sortConfig.direction === 'ascending') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  };

  // Filter function
  const filterData = (data: any[]) => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory = !selectedCategory || 
        item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending'
    }));
  };

  // Data processing functions
  const getStudentsByLocation = () => {
    const locationCounts = students.reduce((acc: { [key: string]: number }, student) => {
        acc[student.location] = (acc[student.location] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(locationCounts)
      .map(([location, count]) => ({
        location,
        count,
        percentage: (count / students.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getStudentsBySpecialization = () => {
    const specializationCounts = students.reduce((acc: { [key: string]: number }, student) => {
        acc[student.specialization] = (acc[student.specialization] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(specializationCounts)
      .map(([specialization, count]) => ({
        specialization,
        count,
        percentage: (count / students.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getToolsByCategory = () => {
    const categoryCount = tools.reduce((acc: { [key: string]: number }, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / tools.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getChallengesByCategory = () => {
    const categoryCount = challenges.reduce((acc: { [key: string]: number }, challenge) => {
      acc[challenge.category] = (acc[challenge.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / challenges.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getToolUsageInChallenges = () => {
    const toolUsage = new Map<string, number>();
    
    challenges.forEach(challenge => {
      if (challenge.tools) {
        challenge.tools.forEach(tool => {
          toolUsage.set(tool, (toolUsage.get(tool) || 0) + 1);
        });
      }
    });

    return Array.from(toolUsage.entries())
      .map(([tool, count]) => ({
        tool,
        count,
        percentage: (count / challenges.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 most used tools
  };

  // Add new data processing functions after the existing ones
  const getStudentDemographics = () => {
    // Calculate role distribution
    const roleDistribution = students.reduce((acc: { [key: string]: number }, student) => {
      acc[student.role] = (acc[student.role] || 0) + 1;
    return acc;
  }, {});

    // Calculate specialization distribution
    const specializationDistribution = students.reduce((acc: { [key: string]: number }, student) => {
      acc[student.specialization] = (acc[student.specialization] || 0) + 1;
      return acc;
    }, {});

    // Calculate location-based metrics
    const locationMetrics = students.reduce((acc: { [key: string]: any }, student) => {
      if (!acc[student.location]) {
        acc[student.location] = {
          total: 0,
          roles: {},
          specializations: {}
        };
      }
      acc[student.location].total++;
      acc[student.location].roles[student.role] = (acc[student.location].roles[student.role] || 0) + 1;
      acc[student.location].specializations[student.specialization] = 
        (acc[student.location].specializations[student.specialization] || 0) + 1;
      return acc;
    }, {});

    return {
      roleDistribution,
      specializationDistribution,
      locationMetrics
    };
  };

  const getStudentsByContinent = () => {
    const continentMapping: { [key: string]: string } = {
      'United States': 'North America',
      'Canada': 'North America',
      'United Kingdom': 'Europe',
      'Germany': 'Europe',
      'France': 'Europe',
      'Spain': 'Europe',
      'Italy': 'Europe',
      'Netherlands': 'Europe',
      'Sweden': 'Europe',
      'Japan': 'Asia',
      'South Korea': 'Asia',
      'Singapore': 'Asia',
      'UAE': 'Middle East',
      'Saudi Arabia': 'Middle East'
    };

    const continentCounts = students.reduce((acc: { [key: string]: number }, student) => {
      const continent = continentMapping[student.location] || 'Other';
      acc[continent] = (acc[continent] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(continentCounts)
      .map(([continent, count]) => ({
        continent,
        count,
        percentage: (count / students.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  // Process data
  const studentsByLocation = getStudentsByLocation();
  const studentsBySpecialization = getStudentsBySpecialization();
  const toolsByCategory = getToolsByCategory();
  const challengesByCategory = getChallengesByCategory();
  const topToolsUsage = getToolUsageInChallenges();

  // Detail view component
  const DetailView = ({ item, type }: { item: any; type: string }) => {
    if (!item) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`${theme.card} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className={`text-xl font-semibold ${theme.text}`}>
              {type === 'student' ? item.name :
               type === 'tool' ? item.name :
               type === 'challenge' ? `#${item.number} ${item.name}` :
               `Workshop #${item.number}`}
            </h2>
                              <button 
              onClick={() => setShowDetails(false)}
              className={`${theme.text} hover:opacity-75`}
            >
              ×
                              </button>
              </div>
             
          <div className="space-y-4">
            {type === 'student' && (
              <>
                <p className={`${theme.subtext}`}>Location: {item.location}</p>
                <p className={`${theme.subtext}`}>Role: {item.role}</p>
                <p className={`${theme.subtext}`}>Specialization: {item.specialization}</p>
                {item.bio && <p className={`${theme.subtext}`}>{item.bio}</p>}
              </>
            )}

            {type === 'tool' && (
              <>
                <p className={`${theme.subtext}`}>Category: {item.category}</p>
                <p className={`${theme.subtext}`}>
                  <a href={item.website} target="_blank" rel="noopener noreferrer" 
                     className="text-indigo-500 hover:text-indigo-400">
                    Visit Website
                  </a>
                </p>
                {item.notes && <p className={`${theme.subtext}`}>{item.notes}</p>}
                {item.useCases && (
                  <div>
                    <p className={`${theme.text} font-medium mb-2`}>Use Cases:</p>
                    <ul className="list-disc pl-5">
                      {item.useCases.map((useCase: string, index: number) => (
                        <li key={index} className={theme.subtext}>{useCase}</li>
                      ))}
                </ul>
              </div>
                )}
              </>
            )}

            {type === 'challenge' && (
              <>
                <p className={`${theme.subtext}`}>{item.description}</p>
                <p className={`${theme.text} font-medium`}>Category: {item.category}</p>
                {item.details && <p className={`${theme.subtext}`}>{item.details}</p>}
                {item.tools && (
                  <div>
                    <p className={`${theme.text} font-medium mb-2`}>Tools Used:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tools.map((tool: string) => (
                        <span key={tool} className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm">
                          {tool}
                              </span>
                      ))}
                </div>
              </div>
                )}
                {item.resources && (
                  <div>
                    <p className={`${theme.text} font-medium mb-2`}>Resources:</p>
                    <ul className="space-y-2">
                      {item.resources.map((resource: string, index: number) => (
                        <li key={index}>
                          <a href={resource} target="_blank" rel="noopener noreferrer" 
                             className="text-indigo-500 hover:text-indigo-400">
                            Resource {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
            </div>
                )}
              </>
            )}

            {type === 'workshop' && (
              <>
                <p className={`${theme.subtext}`}>Date: {item.date}</p>
                <p className={`${theme.subtext}`}>{item.description}</p>
                {item.tools && (
                  <div>
                    <p className={`${theme.text} font-medium mb-2`}>Tools Covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tools.map((tool: string) => (
                        <span key={tool} className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm">
                          {tool}
                              </span>
                      ))}
                </div>
                </div>
                )}
                {item.instructors && (
                  <div>
                    <p className={`${theme.text} font-medium mb-2`}>Instructors:</p>
                    <ul className="list-disc pl-5">
                      {item.instructors.map((instructor: string) => (
                        <li key={instructor} className={theme.subtext}>{instructor}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.youtubeLink && (
                  <a
                    href={item.youtubeLink}
                              target="_blank"
                              rel="noopener noreferrer" 
                    className="inline-block mt-4 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500"
                  >
                    Watch on YouTube
                  </a>
                )}
              </>
                )}
              </div>
        </div>
      </div>
    );
  };

  // Tab content components
  const OverviewTab = () => (
    <>
      {/* Key Insights Widget */}
      <section className={`${theme.card} p-6 rounded-lg shadow mb-8`}>
        <h2 className={`text-xl font-semibold ${theme.text} mb-6 flex items-center`}>
          <span className="text-2xl mr-2">💡</span> Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-lg border ${theme.border} hover:shadow-md transition-shadow duration-200`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-3 flex items-center`}>
              <span className="text-xl mr-2">🌍</span> Global Reach
                    </h3>
            <ul className={`space-y-3 ${theme.text}`}>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>
                  <span className="font-semibold">{new Set(students.map(s => s.location)).size}</span> countries represented
                            </span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>
                  <span className="font-semibold">{getStudentsByContinent()[0].percentage}%</span> students from{' '}
                  <span className="font-semibold">{getStudentsByContinent()[0].continent}</span>
                              </span>
                          </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Most diverse AI bootcamp cohort to date</span>
              </li>
                    </ul>
                </div>

          <div className={`p-6 rounded-lg border ${theme.border} hover:shadow-md transition-shadow duration-200`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-3 flex items-center`}>
              <span className="text-xl mr-2">📚</span> Learning Impact
            </h3>
            <ul className={`space-y-3 ${theme.text}`}>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>
                  <span className="font-semibold">{challenges.length}</span> hands-on challenges completed
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>
                  <span className="font-semibold">{tools.length}</span> AI tools mastered
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>
                  <span className="font-semibold">{workshops.length}</span> interactive workshops conducted
                </span>
              </li>
            </ul>
              </div>

          <div className={`p-6 rounded-lg border ${theme.border} hover:shadow-md transition-shadow duration-200`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-3 flex items-center`}>
              <span className="text-xl mr-2">🎯</span> Skill Development
            </h3>
            <ul className={`space-y-3 ${theme.text}`}>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>
                  <span className="font-semibold">
                    {Object.keys(getStudentDemographics().specializationDistribution).length}
                  </span> specializations covered
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>
                  <span className="font-semibold">{getToolsByCategory()[0].category}</span> is the most used tool category
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>
                  <span className="font-semibold">{getChallengesByCategory()[0].category}</span> is the primary challenge focus
                </span>
              </li>
            </ul>
            </div>
          </div>
      </section>

      {/* Quick Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className={`${theme.card} p-6 rounded-lg shadow transition-all duration-200 hover:shadow-lg cursor-pointer transform hover:-translate-y-1`}
          onClick={() => setActiveTab('students')}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>Students</h3>
          <p className="text-3xl font-bold text-indigo-500">
            {students.filter(s => s.role === 'Designer').length}
          </p>
          <p className={theme.subtext}>Active Participants</p>
                </div>
        <div
          className={`${theme.card} p-6 rounded-lg shadow transition-all duration-200 hover:shadow-lg cursor-pointer transform hover:-translate-y-1`}
          onClick={() => setActiveTab('tools')}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>Tools</h3>
          <p className="text-3xl font-bold text-indigo-500">{tools.length}</p>
          <p className={theme.subtext}>AI Tools Available</p>
                </div>
        <div
          className={`${theme.card} p-6 rounded-lg shadow transition-all duration-200 hover:shadow-lg cursor-pointer transform hover:-translate-y-1`}
          onClick={() => setActiveTab('challenges')}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>Challenges</h3>
          <p className="text-3xl font-bold text-indigo-500">{challenges.length}</p>
          <p className={theme.subtext}>Learning Projects</p>
                </div>
        <div
          className={`${theme.card} p-6 rounded-lg shadow transition-all duration-200 hover:shadow-lg cursor-pointer transform hover:-translate-y-1`}
          onClick={() => setActiveTab('workshops')}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>Workshops</h3>
          <p className="text-3xl font-bold text-indigo-500">{workshops.length}</p>
          <p className={theme.subtext}>Live Sessions</p>
              </div>
      </section>

      {/* Student Demographics Section */}
      <section className="mb-8">
        <h2 className={`text-xl font-semibold ${theme.text} mb-4`}>Student Demographics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className={`${theme.card} p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>
              Geographic Distribution
            </h3>
            <ResponsiveContainer width="100%" height={500}>
                  <BarChart
                data={getStudentsByLocation()}
                layout="vertical"
                margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8884d8" />
                    <stop offset="100%" stopColor="#9b88e8" />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? '#374151' : '#e5e7eb'} 
                  horizontal={true}
                  vertical={false}
                />
                    <XAxis 
                  type="number" 
                  tick={{ fill: darkMode ? '#D1D5DB' : '#374151' }}
                  tickLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                  axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="location" 
                  tick={{ fill: darkMode ? '#D1D5DB' : '#374151' }}
                  tickLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                  axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                  width={80}
                />
                    <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    color: darkMode ? '#D1D5DB' : '#374151',
                    border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`${value} students`, 'Count']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)"
                  radius={[0, 4, 4, 0]}
                />
                  </BarChart>
                </ResponsiveContainer>
                </div>
          <div className={`${theme.card} p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>
              Continental Distribution
                    </h3>
            <div className="flex flex-col items-center justify-center h-[500px]">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={`gradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={color} stopOpacity={1} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={getStudentsByContinent()}
                    cx="50%"
                    cy="50%"
                    labelLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF', strokeWidth: 1 }}
                    innerRadius={80}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="continent"
                    paddingAngle={2}
                    label={({continent, percentage}) => `${continent}: ${percentage}%`}
                    activeShape={(props: any) => {
                      const RADIAN = Math.PI / 180;
                      const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
                      
                      const sin = Math.sin(-RADIAN);
                      const cos = Math.cos(-RADIAN);
                      
                      const sx = cx + (outerRadius + 3) * Math.cos(-startAngle * RADIAN);
                      const sy = cy + (outerRadius + 3) * Math.sin(-startAngle * RADIAN);
                      const ex = cx + (outerRadius + 3) * Math.cos(-endAngle * RADIAN);
                      const ey = cy + (outerRadius + 3) * Math.sin(-endAngle * RADIAN);
                      
                      const sx2 = cx + innerRadius * Math.cos(-startAngle * RADIAN);
                      const sy2 = cy + innerRadius * Math.sin(-startAngle * RADIAN);
                      const ex2 = cx + innerRadius * Math.cos(-endAngle * RADIAN);
                      const ey2 = cy + innerRadius * Math.sin(-endAngle * RADIAN);

                        return (
                        <g>
                          <defs>
                            <filter id="shadow">
                              <feDropShadow dx="0" dy="0" stdDeviation="3" floodOpacity="0.5"/>
                            </filter>
                          </defs>
                          <path 
                            d={`
                              M ${sx} ${sy}
                              A ${outerRadius + 3} ${outerRadius + 3} 0 
                              ${endAngle - startAngle >= 180 ? 1 : 0} 0 
                              ${ex} ${ey}
                              L ${ex2} ${ey2}
                              A ${innerRadius} ${innerRadius} 0
                              ${endAngle - startAngle >= 180 ? 1 : 0} 1
                              ${sx2} ${sy2}
                              Z
                            `}
                            fill={fill}
                            stroke={darkMode ? '#6366F1' : '#4F46E5'}
                            strokeWidth={3}
                            filter="url(#shadow)"
                            style={{ 
                              transform: 'scale(1.03)',
                              transformOrigin: `${cx}px ${cy}px`,
                              transition: 'all 0.3s ease'
                            }}
                          />
                        </g>
                      );
                    }}
                  >
                    {getStudentsByContinent().map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#pieGradient-${index})`}
                        stroke={darkMode ? '#1F2937' : '#FFFFFF'}
                        strokeWidth={2}
                        style={{ 
                          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      color: darkMode ? '#D1D5DB' : '#374151',
                      border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                      borderRadius: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value} students (${props.payload.percentage}%)`,
                      props.payload.continent
                    ]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry, index) => (
                      <span style={{ color: darkMode ? '#D1D5DB' : '#374151' }}>
                        {value}
                              </span>
                            )}
                  />
                </PieChart>
              </ResponsiveContainer>
                  </div>
              </div>
            </div>
        <div className={`${theme.card} p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200`}>
          <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Skill Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={Object.entries(getStudentDemographics().specializationDistribution).map(([key, value]) => ({
                subject: key,
                value: value
              }))}>
                <PolarGrid 
                  stroke={darkMode ? '#374151' : '#e5e7eb'} 
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ 
                    fill: darkMode ? '#D1D5DB' : '#374151',
                    fontSize: 12
                  }}
                />
                <PolarRadiusAxis 
                  stroke={darkMode ? '#4B5563' : '#9CA3AF'}
                  tick={{ 
                    fill: darkMode ? '#D1D5DB' : '#374151',
                    fontSize: 12
                  }}
                />
                <Radar 
                  name="Specializations" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    color: darkMode ? '#D1D5DB' : '#374151',
                    border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`${value} students`, 'Count']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
                </div>
      </section>

      {/* Learning Journey Section */}
      <section className="mb-8">
        <h2 className={`text-xl font-semibold ${theme.text} mb-4`}>Learning Journey</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className={`${theme.card} p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Challenges by Category</h3>
            <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                data={getChallengesByCategory()}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <defs>
                  <linearGradient id="challengeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#82ca9d" stopOpacity={1} />
                    <stop offset="100%" stopColor="#82ca9d" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? '#374151' : '#e5e7eb'}
                  vertical={false}
                />
                    <XAxis 
                      dataKey="category" 
                  tick={{ 
                    fill: darkMode ? '#D1D5DB' : '#374151',
                    fontSize: 12
                  }}
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                  tickLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                  axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                />
                <YAxis 
                  tick={{ 
                    fill: darkMode ? '#D1D5DB' : '#374151',
                    fontSize: 12
                  }}
                  tickLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                  axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                />
                    <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    color: darkMode ? '#D1D5DB' : '#374151',
                    border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`${value} challenges`, 'Count']}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#challengeGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                  </BarChart>
                </ResponsiveContainer>
          </div>
          <div className={`${theme.card} p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200`}>
            <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Top Tools Usage</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={getToolUsageInChallenges()}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <defs>
                  <linearGradient id="toolsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffc658" stopOpacity={1} />
                    <stop offset="100%" stopColor="#ffc658" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? '#374151' : '#e5e7eb'}
                  vertical={false}
                />
                <XAxis 
                  dataKey="tool" 
                  tick={{ 
                    fill: darkMode ? '#D1D5DB' : '#374151',
                    fontSize: 12
                  }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tickLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                  axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                />
                <YAxis 
                  tick={{ 
                    fill: darkMode ? '#D1D5DB' : '#374151',
                    fontSize: 12
                  }}
                  tickLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                  axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    color: darkMode ? '#D1D5DB' : '#374151',
                    border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`${value} times used`, 'Usage']}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#toolsGradient)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`${theme.card} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${theme.text}`}>Recent Workshops</h3>
                            <button 
              onClick={() => setActiveTab('workshops')}
              className={`text-sm ${theme.text} hover:text-indigo-500`}
            >
              View All →
                            </button>
                </div>
          <div className="space-y-4">
            {workshops.slice(0, 3).map((workshop) => (
              <div
                key={workshop.id}
                className={`flex items-start space-x-4 p-4 border rounded-lg ${theme.border} ${theme.card}`}
              >
                <div className={`flex-shrink-0 w-24 text-sm ${theme.subtext}`}>{workshop.date}</div>
                <div className="flex-grow">
                  <h4 className={`font-medium ${theme.text}`}>{workshop.title}</h4>
                  <p className={`${theme.subtext} text-sm mt-1`}>{workshop.description}</p>
                </div>
                  </div>
                ))}
              </div>
            </div>
      </section>
    </>
  );

  const StudentsTab = () => (
    <div className={`${theme.card} p-6 rounded-lg shadow`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className={`text-xl font-semibold ${theme.text}`}>Students Directory</h2>
          <div className="flex items-center bg-gray-100 dark:bg-gray-600/30 rounded-lg p-1">
                            <button 
              onClick={() => setShowTable(false)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                !showTable 
                  ? `${theme.highlight} text-white` 
                  : `${theme.text} hover:bg-gray-200 dark:hover:bg-gray-600`
              }`}
            >
              Cards
                            </button>
            <button
              onClick={() => setShowTable(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                showTable 
                  ? `${theme.highlight} text-white` 
                  : `${theme.text} hover:bg-gray-200 dark:hover:bg-gray-600`
              }`}
            >
              Table
            </button>
                </div>
        </div>
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`px-4 py-2 rounded-md ${theme.card} ${theme.border} ${theme.text} w-64`}
        />
            </div>
            
      {!showTable ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterData(students).map((student) => (
            <div
              key={student.id}
              className={`${theme.card} p-6 rounded-lg border ${theme.border} hover:shadow-lg transition-all duration-200 cursor-pointer`}
              onClick={() => {
                setSelectedItem(student);
                setShowDetails(true);
              }}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${getAvatarColor(student.name)} text-gray-700 dark:text-gray-800`}>
                  {student.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${theme.text} text-lg mb-2`}>{student.name}</h3>
                  <div className={`${theme.subtext} space-y-2`}>
                    <div className="flex items-center">
                      <span className="w-4 mr-2">📍</span>
                      <span>{student.location}</span>
              </div>
                    <div className="flex items-center">
                      <span className="w-4 mr-2">🎨</span>
                      <span>{student.specialization}</span>
            </div>
                    <div className="flex items-center">
                      <span className="w-4 mr-2">👤</span>
                      <span>{student.role}</span>
          </div>
                </div>
                </div>
                </div>
              </div>
          ))}
              </div>
      ) : (
        <div className={`border ${theme.border} rounded-lg overflow-hidden`}>
          <table className="w-full">
            <thead className={`${theme.card} border-b ${theme.border}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider`}>Name</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider`}>Location</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider`}>Specialization</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider`}>Role</th>
                    </tr>
                  </thead>
            <tbody className="divide-y dark:divide-gray-700/50 divide-gray-200">
              {filterData(students).map((student) => (
                <tr
                  key={student.id}
                  className={`${theme.card} cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                  onClick={() => {
                    setSelectedItem(student);
                    setShowDetails(true);
                  }}
                >
                  <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor(student.name)} text-gray-700 dark:text-gray-800 mr-3`}>
                        {student.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      {student.name}
                    </div>
                        </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>{student.location}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>{student.specialization}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>{student.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
      )}
            </div>
  );

  const ToolsTab = () => (
    <div className={`${theme.card} p-6 rounded-lg shadow`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className={`text-xl font-semibold ${theme.text}`}>AI Tools Directory</h2>
          <div className="flex items-center bg-gray-100 dark:bg-gray-600/30 rounded-lg p-1">
            <button 
              onClick={() => setShowTable(false)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                !showTable 
                  ? `${theme.highlight} text-white` 
                  : `${theme.text} hover:bg-gray-200 dark:hover:bg-gray-600`
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setShowTable(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                showTable 
                  ? `${theme.highlight} text-white` 
                  : `${theme.text} hover:bg-gray-200 dark:hover:bg-gray-600`
              }`}
            >
              Table
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className={`px-4 py-2 rounded-md ${theme.card} ${theme.border} ${theme.text} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          >
            <option value="">All Categories</option>
            {Array.from(new Set(tools.map(tool => tool.category))).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`px-4 py-2 rounded-md ${theme.card} ${theme.border} ${theme.text} focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64`}
          />
        </div>
      </div>

      {!showTable ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterData(tools).map((tool) => (
            <div
              key={tool.id}
              className={`${theme.card} p-6 rounded-lg border ${theme.border} hover:shadow-lg transition-all duration-200 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getAvatarColor(tool.name)} text-gray-700 dark:text-gray-800 text-xl font-bold`}>
                  {tool.name[0]}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {tool.category}
                </div>
              </div>
              
              <h3 className={`font-medium ${theme.text} text-lg mb-2`}>{tool.name}</h3>
              <div className={`${theme.subtext} space-y-3`}>
                {tool.description && (
                  <p className="text-sm line-clamp-2">{tool.description}</p>
                )}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      setSelectedItem(tool);
                      setShowDetails(true);
                    }}
                    className={`text-sm ${theme.text} hover:text-indigo-500 transition-colors`}
                  >
                    View Details →
                  </button>
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      darkMode 
                        ? 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-800/50' 
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }`}
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`border ${theme.border} rounded-lg overflow-hidden`}>
          <table className="w-full">
            <thead className={`${theme.card} border-b ${theme.border}`}>
              <tr>
                <th 
                  className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider cursor-pointer hover:text-indigo-500`}
                  onClick={() => handleSort('name')}
                >
                  Tool Name
                  {sortConfig.key === 'name' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider cursor-pointer hover:text-indigo-500`}
                  onClick={() => handleSort('category')}
                >
                  Category
                  {sortConfig.key === 'category' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider`}>
                  Description
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium ${theme.subtext} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700/50 divide-gray-200">
              {filterData(sortData(tools, sortConfig.key)).map((tool) => (
                <tr
                  key={tool.id}
                  className={`${theme.card} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                >
                  <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getAvatarColor(tool.name)} text-gray-700 dark:text-gray-800 font-bold mr-3`}>
                        {tool.name[0]}
                      </div>
                      {tool.name}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap`}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-indigo-900/50 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {tool.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 ${theme.text}`}>
                    <p className="text-sm line-clamp-2">{tool.description}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedItem(tool);
                          setShowDetails(true);
                        }}
                        className={`text-sm ${theme.text} hover:text-indigo-500 transition-colors`}
                      >
                        Details
                      </button>
                      <span className={theme.subtext}>•</span>
                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-500 hover:text-indigo-400 transition-colors"
                      >
                        Website
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const ChallengesTab = () => (
    <div className={`${theme.card} p-6 rounded-lg shadow`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className={`text-xl font-semibold ${theme.text}`}>Challenges Directory</h2>
          <div className="flex items-center bg-gray-100 dark:bg-gray-600/30 rounded-lg p-1">
            <button 
              onClick={() => setShowTable(false)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                !showTable 
                  ? `${theme.highlight} text-white` 
                  : `${theme.text} hover:bg-gray-200 dark:hover:bg-gray-600`
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setShowTable(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                showTable 
                  ? `${theme.highlight} text-white` 
                  : `${theme.text} hover:bg-gray-200 dark:hover:bg-gray-600`
              }`}
            >
              Table
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className={`px-4 py-2 rounded-md ${theme.card} ${theme.border} ${theme.text} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          >
            <option value="">All Categories</option>
            {Array.from(new Set(challenges.map(c => c.category))).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`px-4 py-2 rounded-md ${theme.card} ${theme.border} ${theme.text} focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64`}
          />
        </div>
      </div>

      {!showTable ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filterData(challenges).map((challenge) => (
            <div
              key={challenge.id}
              className={`${theme.card} p-6 rounded-lg border ${theme.border} hover:shadow-lg transition-all duration-200 group cursor-pointer`}
              onClick={() => {
                setSelectedItem(challenge);
                setShowDetails(true);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-bold`}>
                    #{challenge.number}
                  </div>
                  <h3 className={`font-medium ${theme.text} text-lg`}>{challenge.name}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-800'
                }`}>
                  {challenge.category}
                </span>
              </div>
              
              <p className={`${theme.subtext} text-sm mb-4 line-clamp-2`}>{challenge.description}</p>
              
              {challenge.tools && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {challenge.tools.map((tool: string) => (
                    <span 
                      key={tool} 
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        darkMode 
                          ? 'bg-blue-900/30 text-blue-200 border border-blue-800/50' 
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`border ${theme.border} rounded-lg overflow-hidden`}>
          <table className="w-full">
            <thead className={`${theme.card} border-b ${theme.border}`}>
              <tr>
                <th 
                  className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider cursor-pointer hover:text-indigo-500`}
                  onClick={() => handleSort('number')}
                >
                  #
                  {sortConfig.key === 'number' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider cursor-pointer hover:text-indigo-500`}
                  onClick={() => handleSort('name')}
                >
                  Challenge Name
                  {sortConfig.key === 'name' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider cursor-pointer hover:text-indigo-500`}
                  onClick={() => handleSort('category')}
                >
                  Category
                  {sortConfig.key === 'category' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider`}>
                  Description
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme.subtext} uppercase tracking-wider`}>
                  Tools
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700/50 divide-gray-200">
              {filterData(sortData(challenges, sortConfig.key)).map((challenge) => (
                <tr
                  key={challenge.id}
                  onClick={() => {
                    setSelectedItem(challenge);
                    setShowDetails(true);
                  }}
                  className={`${theme.card} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer`}
                >
                  <td className={`px-6 py-4 whitespace-nowrap ${theme.text}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-medium`}>
                      #{challenge.number}
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${theme.text}`}>
                    {challenge.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap`}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-800'
                    }`}>
                      {challenge.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 ${theme.text}`}>
                    <p className="text-sm line-clamp-2">{challenge.description}</p>
                  </td>
                  <td className={`px-6 py-4`}>
                    {challenge.tools && (
                      <div className="flex flex-wrap gap-1.5">
                        {challenge.tools.map((tool: string) => (
                          <span 
                            key={tool}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              darkMode 
                                ? 'bg-blue-900/30 text-blue-200 border border-blue-800/50' 
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const WorkshopsTab = () => (
    <div className={`${theme.card} p-6 rounded-lg shadow`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${theme.text}`}>Workshops Timeline</h2>
        <input
          type="text"
          placeholder="Search workshops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`px-4 py-2 rounded-md ${theme.card} ${theme.border} ${theme.text}`}
        />
      </div>
      <div className="space-y-4">
        {filterData(workshops).map((workshop) => (
          <div
            key={workshop.id}
            className={`${theme.card} p-6 rounded-lg border ${theme.border} hover:shadow-lg transition-all duration-200 cursor-pointer ${
              darkMode ? 'hover:bg-gray-700 hover:border-gray-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => {
              setSelectedItem(workshop);
              setShowDetails(true);
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${theme.text} mb-1`}>{workshop.title}</h3>
                <p className={`${theme.subtext} text-sm`}>
                  <span className={darkMode ? 'text-blue-300' : 'text-blue-600'}>📅</span> {workshop.date}
                </p>
              </div>
              {workshop.youtubeLink && (
                <a 
                  href={workshop.youtubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                    darkMode 
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                      : 'text-red-600 hover:text-red-500 hover:bg-red-50'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  Watch Recording →
                </a>
              )}
            </div>
            <p className={`${theme.text} mt-3 text-sm leading-relaxed`}>{workshop.description}</p>
            {workshop.tools && (
              <div className="flex flex-wrap gap-2 mt-3">
                {workshop.tools.map((tool: string) => (
                  <span key={tool} className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    darkMode 
                      ? 'bg-blue-900 text-blue-200 border border-blue-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`flex min-h-screen ${theme.background}`}>
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        viewDensity={viewDensity}
        setViewDensity={setViewDensity}
        theme={theme}
      />
      
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <header className={`${theme.card} border-b ${theme.border} p-4 sticky top-0 z-20`}>
          <div className="max-w-7xl mx-auto">
            <h1 className={`text-2xl font-bold ${theme.text}`}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className={theme.subtext}>February 2024 Cohort • Side School</p>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Content based on active tab */}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'students' && <StudentsTab />}
            {activeTab === 'tools' && <ToolsTab />}
            {activeTab === 'challenges' && <ChallengesTab />}
            {activeTab === 'workshops' && <WorkshopsTab />}
          </div>
      </main>
      </div>

      {/* Keep existing modals */}
      {showDetails && selectedItem && (
        <DetailView
          item={selectedItem}
          type={
            'role' in selectedItem ? 'student' :
            'website' in selectedItem ? 'tool' :
            'tools' in selectedItem ? 'challenge' : 'workshop'
          }
        />
      )}
    </div>
  );
};

export default DashboardPage;