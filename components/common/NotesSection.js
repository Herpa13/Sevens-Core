"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesSection = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("./Icon");
const TextArea_1 = require("./TextArea");
const FileUpload_1 = require("./FileUpload");
const TextInput_1 = require("./TextInput");
const NoteItem = ({ note, onUpdateNote, onDeleteNote }) => {
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [editedText, setEditedText] = (0, react_1.useState)(note.text);
    const [attachments, setAttachments] = (0, react_1.useState)(note.attachments || []);
    const [filesToAdd, setFilesToAdd] = (0, react_1.useState)([]);
    const [isArchiving, setIsArchiving] = (0, react_1.useState)(false);
    const [archiveReason, setArchiveReason] = (0, react_1.useState)('');
    const handleSave = () => {
        // In a real app, you'd upload filesToAdd here and get URLs
        const newAttachments = filesToAdd.map((file, i) => ({
            id: `temp-${Date.now()}-${i}`,
            name: file.name,
            url: URL.createObjectURL(file) // Placeholder URL
        }));
        onUpdateNote({
            ...note,
            text: editedText,
            attachments: [...attachments, ...newAttachments]
        });
        setIsEditing(false);
        setFilesToAdd([]);
    };
    const handleCancel = () => {
        setEditedText(note.text);
        setAttachments(note.attachments || []);
        setFilesToAdd([]);
        setIsEditing(false);
    };
    const handleFileSelect = (file) => {
        if (file)
            setFilesToAdd(prev => [...prev, file]);
    };
    const removeExistingAttachment = (id) => {
        setAttachments(prev => prev.filter(att => att.id !== id));
    };
    const removeNewFile = (fileName) => {
        setFilesToAdd(prev => prev.filter(file => file.name !== fileName));
    };
    const handleArchive = () => {
        if (archiveReason.trim() === '') {
            alert('Por favor, introduce una razón para archivar.');
            return;
        }
        onUpdateNote({ ...note, status: 'Archivada', archiveReason });
        setIsArchiving(false);
        setArchiveReason('');
    };
    if (isArchiving) {
        return (<div className="bg-slate-700/50 border-l-4 border-yellow-500 p-3 rounded-r-lg shadow-md">
                <h4 className="text-sm font-semibold text-yellow-300 mb-2">Archivar Nota</h4>
                <p className="text-xs text-slate-400 mb-2">Introduce la razón por la que esta nota ya no es relevante.</p>
                <TextInput_1.TextInput value={archiveReason} onChange={(e) => setArchiveReason(e.target.value)} placeholder="Ej: Problema solucionado, información obsoleta..."/>
                <div className="mt-3 flex justify-end space-x-2">
                    <button onClick={() => setIsArchiving(false)} className="px-3 py-1 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 text-sm">Cancelar</button>
                    <button onClick={handleArchive} className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm">Confirmar Archivo</button>
                </div>
            </div>);
    }
    if (isEditing) {
        return (<div className="bg-slate-700/50 border-l-4 border-cyan-500 p-3 rounded-r-lg shadow-md">
                <TextArea_1.TextArea value={editedText} onChange={(e) => setEditedText(e.target.value)} rows={3}/>
                <div className="mt-2 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400">Archivos Adjuntos:</h4>
                    {attachments.map(att => (<div key={att.id} className="flex items-center justify-between text-sm bg-slate-600 p-1 rounded">
                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate">{att.name}</a>
                            <button onClick={() => removeExistingAttachment(att.id)} className="text-red-400 hover:text-red-500 ml-2 p-1"><Icon_1.Icon name="trash-alt"/></button>
                        </div>))}
                    {filesToAdd.map(file => (<div key={file.name} className="flex items-center justify-between text-sm bg-green-500/20 p-1 rounded">
                            <span className="truncate">{file.name}</span>
                            <button onClick={() => removeNewFile(file.name)} className="text-red-400 hover:text-red-500 ml-2 p-1"><Icon_1.Icon name="trash-alt"/></button>
                        </div>))}
                    <FileUpload_1.FileUpload onFileSelect={handleFileSelect}/>
                </div>
                <div className="mt-3 flex justify-end space-x-2">
                    <button onClick={handleCancel} className="px-3 py-1 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 text-sm">Cancelar</button>
                    <button onClick={handleSave} className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">Guardar</button>
                </div>
            </div>);
    }
    return (<div className="bg-slate-800 border-l-4 border-cyan-500 p-3 rounded-r-lg">
            <div className="flex justify-between items-start">
              <p className="text-slate-200 text-sm whitespace-pre-wrap flex-grow">{note.text}</p>
              <div className="flex-shrink-0 ml-4 flex space-x-2">
                <button onClick={() => setIsEditing(true)} title="Editar" className="text-cyan-400 hover:text-cyan-300"><Icon_1.Icon name="pencil-alt"/></button>
                <button onClick={() => setIsArchiving(true)} title="Archivar" className="text-yellow-400 hover:text-yellow-300"><Icon_1.Icon name="archive"/></button>
                <button onClick={() => onDeleteNote(note.id)} title="Eliminar" className="text-red-400 hover:text-red-500"><Icon_1.Icon name="trash"/></button>
              </div>
            </div>
            {note.attachments && note.attachments.length > 0 && (<div className="mt-2 border-t border-slate-700 pt-2 space-y-1">
                    {note.attachments.map(att => (<a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-cyan-400 hover:underline">
                            <Icon_1.Icon name="paperclip" className="mr-1.5 text-slate-400"/> {att.name}
                        </a>))}
                </div>)}
            <div className="text-xs text-slate-400 mt-2">
              <span>{note.authorName}</span> - <span>{new Date(note.updatedAt).toLocaleString()}</span>
            </div>
        </div>);
};
const NotesSection = ({ notes, onAddNote, onUpdateNote, onDeleteNote }) => {
    const [newNoteText, setNewNoteText] = (0, react_1.useState)('');
    const [newNoteFiles, setNewNoteFiles] = (0, react_1.useState)([]);
    const activeNotes = notes.filter(n => n.status === 'Activa');
    const handleAdd = () => {
        if (newNoteText.trim()) {
            onAddNote(newNoteText.trim(), newNoteFiles);
            setNewNoteText('');
            setNewNoteFiles([]);
        }
    };
    const handleFileSelect = (file) => {
        if (file) {
            setNewNoteFiles(prev => [...prev, file]);
        }
    };
    const removeNewFile = (fileName) => {
        setNewNoteFiles(prev => prev.filter(f => f.name !== fileName));
    };
    return (<div>
      <h3 className="text-lg font-semibold mb-3 text-slate-200">Notas Activas</h3>
      <div className="space-y-3 mb-6">
        {activeNotes.map(note => (<NoteItem key={note.id} note={note} onUpdateNote={onUpdateNote} onDeleteNote={onDeleteNote}/>))}
        {activeNotes.length === 0 && <p className="text-slate-400 text-center py-4">No hay notas activas para este elemento.</p>}
      </div>

      <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700">
        <h4 className="font-semibold mb-2 text-slate-200">Añadir una nueva nota</h4>
        <TextArea_1.TextArea value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} placeholder="Escribe tu nota aquí..." rows={3} className="mb-2"/>
        <div className="space-y-1 mb-3">
             {newNoteFiles.map(file => (<div key={file.name} className="flex items-center justify-between text-sm bg-slate-700 p-1.5 rounded">
                    <span className="truncate"><Icon_1.Icon name="paperclip" className="mr-2"/>{file.name}</span>
                    <button onClick={() => removeNewFile(file.name)} className="text-red-400 hover:text-red-500 ml-2 p-1"><Icon_1.Icon name="times"/></button>
                </div>))}
        </div>
        <div className="flex justify-between items-center">
            <FileUpload_1.FileUpload onFileSelect={handleFileSelect}/>
            <button onClick={handleAdd} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:bg-slate-600 disabled:text-slate-400" disabled={!newNoteText.trim()}>
              <Icon_1.Icon name="plus" className="mr-2"/>
              Añadir Nota
            </button>
        </div>
      </div>
    </div>);
};
exports.NotesSection = NotesSection;
