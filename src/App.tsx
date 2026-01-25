import { InstructionCards } from "./InstructionCards";

function App() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">LiMIDI</h1>
          <p className="text-xl text-gray-300 mt-4">
            Connect your mobile device to your DAW wirelessly
          </p>
        </div>

        <InstructionCards />
      </div>
    </div>
  );
}

export default App;
