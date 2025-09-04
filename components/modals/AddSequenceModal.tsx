import React, { useState, useMemo, FC } from 'react';
import type { AppData, SequenceTemplate, MediaAsset, ProjectSequence } from '../../types';
import { Icon } from '../common/Icon';
import { TextInput } from '../common/TextInput';

interface AddSequenceModalProps {
  appData: AppData;
  onClose: () => void;
  onAdd: (newSequence: Omit<ProjectSequence, 'id' | 'order' | 'transitionToNext'>) => void;
}

export const AddSequenceModal: React.FC<AddSequenceModalProps> = ({ appData, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState<'template' | 'asset' | 'blank'>('template');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allAssetTags = useMemo(() => {
    const tagSet = new Set<string>();
    appData.mediaAssets.forEach(a => a.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  }, [appData.mediaAssets]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  
  const handleAddFromTemplate = (template: SequenceTemplate) => {
    onAdd({
        sequenceTemplateId: template.id as number,
        duration: template.defaultDuration,
        voiceoverScript: '',
        image: { userDescription: '', finalPrompt: '', sourceUrl: '' },
        video: { userDescription: '', finalPrompt: '', sourceUrl: '' },
    });
  };

  const handleAddFromAsset = (asset: MediaAsset) => {
      onAdd({
        mediaAssetId: asset.id as number,
        duration: asset.duration,
        voiceoverScript: asset.voiceoverScript || '',
        image: { userDescription: '', finalPrompt: '', sourceUrl: asset.imageUrl },
        video: { userDescription: '', finalPrompt: '', sourceUrl: asset.videoUrl },
    });
  };
  
  const handleAddBlank = () => {
    onAdd({
        duration: 5, // default duration
        voiceoverScript: '',
        image: { userDescription: '', finalPrompt: '', sourceUrl: '' },
        video: { userDescription: '', finalPrompt: '', sourceUrl: '' },
    });
  };

  const filteredTemplates = useMemo(() => {
    return appData.sequenceTemplates.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appData.sequenceTemplates, searchTerm]);

  const filteredAssets = useMemo(() => {
    return appData.mediaAssets.filter(a => {
        const searchMatch =
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.description && a.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => a.tags?.includes(tag));

        return searchMatch && tagsMatch;
    });
  }, [appData.mediaAssets, searchTerm, selectedTags]);

  const TabButton: FC<{ title: string; isActive: boolean; onClick: () => void; }> = ({ title, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 ${
        isActive ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      {title}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-200">Añadir Secuencia al Storyboard</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
        </div>
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <TabButton title="Desde Plantilla" isActive={activeTab === 'template'} onClick={() => setActiveTab('template')} />
            <TabButton title="Biblioteca de Medios" isActive={activeTab === 'asset'} onClick={() => setActiveTab('asset')} />
             <TabButton title="Secuencia en Blanco" isActive={activeTab === 'blank'} onClick={() => setActiveTab('blank')} />
          </div>
          {activeTab !== 'blank' && (
            <>
                <TextInput 
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="mt-3"
                />
                {activeTab === 'asset' && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {allAssetTags.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-2 py-1 text-xs rounded-full ${selectedTags.includes(tag) ? 'bg-cyan-500 text-slate-900 font-semibold' : 'bg-slate-600 hover:bg-slate-500'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </>
          )}
        </div>
        <div className="p-4 space-y-2 overflow-y-auto">
          {activeTab === 'template' && filteredTemplates.map(template => (
            <div 
                key={template.id} 
                onClick={() => handleAddFromTemplate(template)}
                className="p-3 rounded-md border border-slate-700 bg-slate-800/60 hover:border-cyan-500 cursor-pointer"
            >
              <h4 className="font-bold text-slate-200">{template.name}</h4>
              <p className="text-sm text-slate-400">{template.description}</p>
              <span className="text-xs font-mono text-cyan-400 bg-slate-700 px-2 py-0.5 rounded-full mt-2 inline-block">
                {template.defaultDuration}s
              </span>
            </div>
          ))}
          {activeTab === 'asset' && filteredAssets.map(asset => (
             <div 
                key={asset.id} 
                onClick={() => handleAddFromAsset(asset)}
                className="p-3 rounded-md border border-slate-700 bg-slate-800/60 hover:border-cyan-500 cursor-pointer flex items-center space-x-4"
            >
                <div className="w-24 h-16 bg-slate-900 rounded-md flex-shrink-0">
                    {asset.imageUrl && <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover rounded-md"/>}
                </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-slate-200">{asset.name}</h4>
                    <p className="text-sm text-slate-400 truncate">{asset.description}</p>
                </div>
                 <span className="text-xs font-mono text-cyan-400 bg-slate-700 px-2 py-0.5 rounded-full flex-shrink-0">
                    {asset.duration}s
                </span>
            </div>
          ))}
          {activeTab === 'blank' && (
              <div 
                onClick={handleAddBlank}
                className="p-8 rounded-md border-2 border-dashed border-slate-600 bg-slate-800/60 hover:border-cyan-500 cursor-pointer text-center"
            >
              <Icon name="plus-square" className="text-4xl text-slate-500 mb-2"/>
              <h4 className="font-bold text-slate-200">Añadir Secuencia Vacía</h4>
              <p className="text-sm text-slate-400">Empezarás con una tarjeta en blanco para definir una nueva escena desde cero.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};