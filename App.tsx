import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function App() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat', // Le decimos explícitamente dónde buscar al cerebro
  });
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch px-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Analizador Clínico IA</h1>
      
      <div className="space-y-4 mb-20">
        {messages.map(m => (
          <div key={m.id} className={`whitespace-pre-wrap p-4 rounded-lg ${m.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
            <div className="font-bold mb-1">{m.role === 'user' ? 'Tú' : 'IA'}:</div>
            <div>{m.content}</div>
            {m?.experimental_attachments
              ?.filter((attachment) => attachment?.contentType?.startsWith('image/'))
              .map((attachment, index) => (
                <img
                  key={`${m.id}-${index}`}
                  src={attachment.url}
                  width={200}
                  alt="imagen subida"
                  className="mt-2 rounded-md shadow-sm"
                />
              ))}
          </div>
        ))}
        {messages.length === 0 && (
            <p className="text-center text-gray-500">Sube una imagen médica para comenzar...</p>
        )}
      </div>

      <form
        className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-center"
        onSubmit={event => {
          handleSubmit(event, {
            experimental_attachments: files,
          });
          setFiles(undefined);
        }}
      >
        <div className="w-full max-w-md flex gap-2">
            <input
              type="file"
              className="hidden"
              id="file-input"
              accept="image/*"
              onChange={event => {
                if (event.target.files) {
                  setFiles(event.target.files);
                }
              }}
            />
            <label 
                htmlFor="file-input" 
                className={`p-3 rounded-md cursor-pointer flex items-center justify-center transition-colors ${files ? 'bg-green-100 text-green-700 border-green-300 border' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                title="Subir imagen"
            >
                {files ? '✅' : '📷'}
            </label>
            
            <input
              className="flex-1 border p-2 rounded-md shadow-sm"
              value={input}
              placeholder="Describe esta imagen..."
              onChange={handleInputChange}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-medium">Enviar</button>
        </div>
      </form>
    </div>
  );
}
