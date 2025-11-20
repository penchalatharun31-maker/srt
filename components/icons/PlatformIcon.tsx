import React from 'react';

const PlatformIcon: React.FC<{ platform: 'LinkedIn' | 'Instagram' | 'Twitter' }> = ({ platform }) => {
    if (platform === 'LinkedIn') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
            </svg>
        );
    }
     if (platform === 'Twitter') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.177-1.354.23-2.06.088.621 1.954 2.425 3.377 4.563 3.414-1.652 1.299-3.738 2.074-6.01 2.074-.39 0-.775-.023-1.15-.067 2.139 1.373 4.68 2.173 7.447 2.173 8.964 0 13.88-7.423 13.88-13.878 0-.21 0-.42-.015-.63.951-.688 1.778-1.55 2.428-2.528z" />
            </svg>
        )
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" strokeWidth="2" />
        </svg>
    );
};

export default PlatformIcon;
