import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Weather App</h1>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <p className="text-center text-gray-600">Welcome to Weather App</p>
      </main>
    </div>
  );
};

export default App;
