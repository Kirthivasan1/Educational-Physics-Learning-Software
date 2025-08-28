import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Play, Zap, ArrowRight, Loader2, RefreshCw } from "lucide-react";

const ViewPlaygrounds = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/playground");
        setPlaygrounds(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load playgrounds. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePlaygroundClick = (playgroundId) => {
    navigate(`/playground?id=${playgroundId}`);
  };

  const retryFetch = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5000/api/playground");
        setPlaygrounds(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load playgrounds. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-100 mb-2">Loading Playgrounds</h2>
          <p className="text-slate-300">Please wait while we fetch your physics simulations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-100 mb-2">Oops! Something went wrong</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={retryFetch}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
            <Play className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Physics Playgrounds
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Explore and interact with different physics simulations. Each playground offers unique experiments and learning opportunities.
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full shadow-lg border border-slate-700">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-200">{playgrounds.length} Playgrounds Available</span>
          </div>
        </div>

        {/* Playgrounds Grid */}
        {playgrounds.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-100 mb-2">No Playgrounds Yet</h3>
            <p className="text-slate-400 mb-6">It looks like there are no physics playgrounds available at the moment.</p>
            <button
              onClick={retryFetch}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playgrounds.map((playground, index) => (
              <div
                key={playground._id}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-blue-500/20 border border-slate-700 hover:border-blue-500/50 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Playground Card Header */}
                <div className="relative h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm border border-white/30">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white/90 text-sm font-medium">Playground {index + 1}</div>
                  </div>
                  
                  {/* Decorative Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                    <div className="absolute inset-0 bg-white rounded-full transform translate-x-6 -translate-y-6"></div>
                    <div className="absolute inset-0 bg-white rounded-full transform translate-x-10 -translate-y-2"></div>
                  </div>
                  
                  {/* Animated Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Playground Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    {playground.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Interactive physics simulation with drag-and-drop objects, gravity effects, and real-time collision detection.
                  </p>
                  
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span>Physics Engine</span>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handlePlaygroundClick(playground._id)}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-blue-600 hover:to-purple-600 text-slate-200 hover:text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25 border border-slate-600 hover:border-transparent"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Launch Playground
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* Border Glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl border border-blue-500/50 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Information */}
        <div className="mt-16 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About Physics Playgrounds
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-400">
              <div className="flex flex-col items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-200">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-slate-200 mb-1">Real Physics</span>
                <span className="text-center">Experience gravity, collisions, and momentum in real-time simulations</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-200">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-slate-200 mb-1">Interactive</span>
                <span className="text-center">Drag and drop objects to create your own physics experiments</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-pink-500/50 transition-all duration-200">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-slate-200 mb-1">Educational</span>
                <span className="text-center">Learn physics concepts through hands-on experimentation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPlaygrounds;