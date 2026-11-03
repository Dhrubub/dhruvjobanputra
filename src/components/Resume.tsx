import { useEffect } from 'react';

// /resume is a stable alias for the PDF, which lives in public/resume.pdf
// so its URL never changes when the file is updated.
const Resume = () => {
	useEffect(() => {
		window.location.replace('/resume.pdf');
	}, []);

	return null;
};

export default Resume;
