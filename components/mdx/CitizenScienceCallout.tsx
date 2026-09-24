import React from 'react';

interface CitizenScienceCalloutProps {
    url: string;
    projectName: string;
}

export const CitizenScienceCallout: React.FC<CitizenScienceCalloutProps> = ({ url, projectName }) => {
    return (
        <div className="bg-sky-50 border-l-4 border-sky-500 p-4 my-6 rounded-r-xl no-print">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <span className="text-xl">📋</span>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-bold text-sky-800 uppercase tracking-wide">
                        Citizen Science Activity
                    </h3>
                    <div className="mt-2 text-sm text-sky-700">
                        <p>
                            Help scientists track nature! You can record your sightings for this topic on the 
                            {' '}<a href={url} target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-sky-900">{projectName}</a> website.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
