import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 mt-8 py-8 border-t border-gray-700">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-bold mb-4">Join the Crazzzy Monsters adventure!</h3>
        <p className="text-gray-400">
          Built By <a 
          href="https://twitter.com/FR33D3v" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-orange-500 hover:text-orange-600 transition-colors"
          >
          FR33D3V
          </a>
        </p>
        <div className="flex justify-center space-x-6 mt-6">
          <a
            href="https://discord.com/invite/YjYHgKNapj"
            className="text-gray-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
          <a
            href="https://x.com/CrazzzyMonsters"
            className="text-gray-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://crazzzymonsters.com/static/media/Policy.8820d95f7ec77e6dcc79.pdf"
            className="text-gray-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms & Conditions
          </a>
        </div>
        <p className="text-gray-400 mt-6">© 2024 - Powered by Crazzzy Monsters</p>
      </div>
    </footer>
  );
}