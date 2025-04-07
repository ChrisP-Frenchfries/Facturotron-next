'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        if (selectedFile) {
            setFile(selectedFile);
            setError('');

            // Créer un aperçu pour les images
            if (selectedFile.type.startsWith('image/')) {
                setPreview(URL.createObjectURL(selectedFile));
            } else {
                // Icône pour PDF
                setPreview(null);
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            setError('Veuillez sélectionner un fichier.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('document', file);

        try {
            const response = await fetch('http://localhost:4242/api/facture', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'upload');
            }

            const data = await response.json();
            setMessage(data.message || 'Fichier uploadé avec succès!');
            setError('');
            console.log('Réponse du serveur :', data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(errorMessage);
            setMessage('');
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header - Style Famicom */}
                <div className="bg-[#E30B20] text-white p-4 border-b-4 border-[#D8AE5C]">
                    <h1 className="text-xl font-bold text-center">Upload de Fichier</h1>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all hover:border-[#D8AE5C] focus-within:border-[#D8AE5C]">
                            {preview ? (
                                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                                    <img src={preview} alt="Aperçu" className="object-contain w-full h-full" />
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="absolute top-2 right-2 bg-[#E30B20] text-white p-1 rounded-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ) : file && file.type.includes('pdf') ? (
                                <div className="text-center p-4">
                                    <svg className="mx-auto h-12 w-12 text-[#E30B20]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mt-2 text-sm font-medium">{file.name}</p>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="mt-2 text-xs text-[#E30B20] hover:underline"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Glissez-déposez un fichier ici, ou
                                    </p>
                                    <label htmlFor="file-upload" className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#E30B20] hover:bg-[#c00a1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D8AE5C] cursor-pointer">
                                        Parcourir
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" />
                                    </label>
                                </div>
                            )}
                        </div>

                        {file && (
                            <div className="text-sm text-gray-600">
                                <p><span className="font-medium">Nom:</span> {file.name}</p>
                                <p><span className="font-medium">Type:</span> {file.type || 'Non spécifié'}</p>
                                <p><span className="font-medium">Taille:</span> {(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E30B20] hover:bg-[#c00a1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D8AE5C] ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isUploading || !file}
                        >
                            {isUploading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Envoi en cours...
                                </>
                            ) : "Uploader"}
                        </button>
                    </form>

                    {message && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer - Style Famicom */}
                <div className="bg-[#D8AE5C] p-2 text-center text-xs text-[#E30B20] font-medium">
                    Famicom Style Upload
                </div>
            </div>
        </div>
    );
}