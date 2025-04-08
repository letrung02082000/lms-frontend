import React, { useEffect, useState } from 'react';

const ElearningStudentBookPage = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const moodleToken = localStorage.getItem('moodleToken');
  const fileUrl =
    new URLSearchParams(window.location.search).get('url')?.split('?')[0] +
    `?token=${moodleToken}`;

  useEffect(() => {
    fetch(fileUrl)
      .then((res) => res.text())
      .then((html) => {
        setHtmlContent(html);
      })
      .catch((err) => {
        console.error('Failed to load HTML:', err);
      });
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'scroll',
        padding: 20,
      }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default ElearningStudentBookPage;
