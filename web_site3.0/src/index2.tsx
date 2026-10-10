import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './AppRouter';

const container = document.getElementById('root');
if (container) {
	const root = createRoot(container);
	root.render(<AppRouter />);
} else {
	// Fallback for environments without a root element
	console.error('Root container missing in HTML.');
}