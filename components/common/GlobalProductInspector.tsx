import React, { useState, useMemo, FC } from 'react';
import type { AppData, Product, AmazonContent } from '../../types';
import { Icon } from './Icon';
import { TextInput } from './TextInput';
import { CollapsibleSection } from './CollapsibleSection';

interface GlobalProductInspectorProps {
  appData: AppData;
  isOpen: boolean;
  onClose: () => void;
}

const FieldDisplay: FC<{ label: string; value: any; isHtml?: boolean }> = ({ label, value, isHtml = false }) => {
    const displayValue = useMemo(() => {
        if (value === null || value === undefined) return <i className="text-slate-500">N/A</i>;
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'boolean') return value ? <span className="font-bold text-green-400">Sí</span> : <span className="font-bold text-red-400">No</span>
        if (typeof value === 'object') return <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>;
        return String(value);
    }, [value]);

    const copyToClipboard = () => {
        const textToCopy = Array.isArray(value) ? value.join(', ') : String(value);
        navigator.clipboard.writeText(textToCopy);
    };

    return (
        <div className="grid grid-cols-3 gap-2 text-xs items-start py-1.5 border-b border-slate-700/50 relative group">
            <strong className="text-slate-400 col-span-1">{label}</strong>
            {isHtml ? (
                 <div className="text-slate-300 col-span-2 break-words" dangerouslySetInnerHTML={{ __html: String(displayValue) }}></div>
            ) : (
                <span className="text-slate-300 col-span-2 break-words">{displayValue}</span>
            )}
            <button onClick={copyToClipboard} className="text-cyan-400 hover:text-cyan-300 absolute right-0 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="copy"/>
            </button>
        </div>
    );
};


export const GlobalProductInspector: React.FC<GlobalProductInspectorProps> = ({ appData, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    if (!lowerSearch) return appData.products.slice(0, 15);
    return appData.products.filter(p => 
        p.name.toLowerCase().includes(lowerSearch) || 
        p.sku.toLowerCase().includes(lowerSearch)
    );
  }, [appData.products, searchTerm]);

  const handleSelectProduct = (product: Product) => {
      setSelectedProduct(product);
      setSearchTerm('');
  };

  const handleBackToSearch = () => {
      setSelectedProduct(null);
  };
  
  const renderProductDetails = () => {
      if (!selectedProduct) return null;

      const activeAmazonContentByCountry: Record<string, AmazonContent | undefined> = {};
      appData.countries.forEach(country => {
        const content = selectedProduct.amazonContents.find(ac => ac.countryId === country.id);
        if (content && content.currentVersionId) {
            activeAmazonContentByCountry[country.iso] = content;
        }
      });
      
      const envase = appData.envases.find(e => e.id === selectedProduct.envaseId);

      return (
        <div className="space-y-2">
            <CollapsibleSection title="Información General">
                <FieldDisplay label="Nombre" value={selectedProduct.name} />
                <FieldDisplay label="SKU" value={selectedProduct.sku} />
                <FieldDisplay label="Marca" value={selectedProduct.marca} />
                <FieldDisplay label="EAN" value={selectedProduct.ean} />
                <FieldDisplay label="ASIN" value={selectedProduct.asin} />
                <FieldDisplay label="Formato" value={selectedProduct.format} />
                <FieldDisplay label="Unidades" value={selectedProduct.units} />
                <FieldDisplay label="Estado" value={selectedProduct.status} />
                <FieldDisplay label="Otros Nombres" value={selectedProduct.otrosNombres} />
            </CollapsibleSection>

            <CollapsibleSection title="Media y Enlaces">
                <div className="grid grid-cols-2 gap-4 my-2">
                    <div>
                        <strong className="text-xs text-slate-400 block mb-1">Imagen Principal</strong>
                        {selectedProduct.mainImageUrl ? <img src={selectedProduct.mainImageUrl} alt="Imagen Principal" className="rounded-md border border-slate-700" /> : <i className="text-slate-500 text-xs block">N/A</i>}
                    </div>
                    <div>
                        <strong className="text-xs text-slate-400 block mb-1">Código de Barras</strong>
                        {selectedProduct.barcodeImageUrl ? <img src={selectedProduct.barcodeImageUrl} alt="Código de Barras" className="rounded-md border border-slate-700 bg-white p-1" /> : <i className="text-slate-500 text-xs block">N/A</i>}
                    </div>
                </div>
                <FieldDisplay label="Videos Asociados" value={selectedProduct.videoIds?.map(id => appData.videos.find(v => v.id === id)?.name).filter(Boolean)} />
            </CollapsibleSection>

            <CollapsibleSection title="Marketing Estratégico">
                <FieldDisplay label="Público Objetivo" value={selectedProduct.publicoObjetivo} />
                <FieldDisplay label="Key Selling Points" value={selectedProduct.keySellingPoints} />
                <FieldDisplay label="Mini Narrativa" value={selectedProduct.miniNarrativa} />
                <FieldDisplay label="Puntos Fuertes" value={selectedProduct.puntosFuertes} />
                <FieldDisplay label="Puntos Débiles" value={selectedProduct.puntosDebiles} />
                <FieldDisplay label="Beneficios Genéricos" value={selectedProduct.beneficiosGenericos} />
                <FieldDisplay label="Análisis Competencia" value={selectedProduct.analisisCompetencia} />
                <FieldDisplay label="Resumen IA Reseñas" value={selectedProduct.resenasIaAmazon} />
                <FieldDisplay label="Ideas Contenido Redes" value={selectedProduct.ideasContenidoRedes} />
                <FieldDisplay label="Ejemplos Testimonios" value={selectedProduct.ejemplosTestimonios} />
            </CollapsibleSection>
            
            <CollapsibleSection title="Pesos y Medidas">
                <FieldDisplay label="Peso Neto (Etiqueta)" value={selectedProduct.pesoNetoEtiqueta} />
                <FieldDisplay label="Peso Neto (g)" value={selectedProduct.pesoNeto} />
                <FieldDisplay label="Peso por Toma (g)" value={selectedProduct.unitWeight} />
                <FieldDisplay label="Peso Envío (g)" value={selectedProduct.pesoEnvio} />
            </CollapsibleSection>

            <CollapsibleSection title="Uso y Dosificación">
                <FieldDisplay label="Modo de Uso" value={selectedProduct.modoUso} />
                <FieldDisplay label="Unidad de Toma" value={selectedProduct.unidadToma} />
                <FieldDisplay label="Unidades por Toma" value={selectedProduct.unidadesPorToma} />
                <FieldDisplay label="Dosis Diaria Rec." value={selectedProduct.recommendedDailyDose} />
                <FieldDisplay label="Sugerencias de Uso" value={selectedProduct.sugerenciasUso} />
            </CollapsibleSection>

            <CollapsibleSection title="Etiquetado y Regulatorio">
                <FieldDisplay label="Países Permitidos" value={selectedProduct.allowedCountryIds?.map(id => appData.countries.find(c => c.id === id)?.name).join(', ')} />
                <FieldDisplay label="Cantidad Neta (Etiqueta)" value={selectedProduct.netQuantityLabel} />
                <FieldDisplay label="Cantidad Neta (Info. Nutricional)" value={selectedProduct.netQuantityNutritionalInfo} />
                <FieldDisplay label="Información Nutricional" value={selectedProduct.informacionNutricional} />
                <FieldDisplay label="Alérgenos" value={selectedProduct.alergenos} />
                <FieldDisplay label="Conservación" value={selectedProduct.conservacion} />
                <FieldDisplay label="Características Producto" value={selectedProduct.caracteristicasProducto} />
            </CollapsibleSection>
            
            <CollapsibleSection title="Envase y Caducidad">
                 <FieldDisplay label="Envase" value={envase?.name || 'N/A'} />
                 <FieldDisplay label="Color Envase" value={selectedProduct.envaseColor} />
                 <FieldDisplay label="Color Tapa" value={selectedProduct.tapaColor} />
                 <FieldDisplay label="Tiene Repercap" value={selectedProduct.hasRepercap} />
                 <FieldDisplay label="Repercap Serigrafiado" value={selectedProduct.isRepercapScreenPrinted} />
                 <FieldDisplay label="Caducidad (meses)" value={selectedProduct.expiryInMonths} />
                 <FieldDisplay label="Duración Producto" value={selectedProduct.duracionProducto ? `${selectedProduct.duracionProducto.valor} ${selectedProduct.duracionProducto.unidad}` : 'N/A'} />
            </CollapsibleSection>
            
            <CollapsibleSection title="Relaciones">
                <FieldDisplay label="Competidores Asociados" value={selectedProduct.competitorProductIds?.map(id => appData.competitorProducts.find(p => p.id === id)?.name).filter(Boolean)} />
            </CollapsibleSection>

             <CollapsibleSection title="Composición">
                {selectedProduct.composition?.map((item, index) => {
                    const ingredient = appData.ingredients.find(i => i.id === item.ingredientId);
                    return (
                        <FieldDisplay
                            key={index}
                            label={ingredient?.latinName || `ID: ${item.ingredientId}`}
                            value={`${item.quantity} ${ingredient?.measureUnit}`}
                        />
                    );
                })}
            </CollapsibleSection>

            {selectedProduct.shopifyContent && (
            <CollapsibleSection title="Contenido Shopify">
                <FieldDisplay label="Título Shopify" value={selectedProduct.shopifyContent.titleShopify} />
                <FieldDisplay label="Descripción Shopify" value={selectedProduct.shopifyContent.descriptionShopify} isHtml />
                <FieldDisplay label="Beneficios Shopify" value={selectedProduct.shopifyContent.benefitsShopify} />
                <FieldDisplay label="Resumen Enfocado" value={selectedProduct.shopifyContent.focusSummaryShopify} />
                <FieldDisplay label="Beneficio Destacado 1" value={selectedProduct.shopifyContent.highlightBenefit1} />
                <FieldDisplay label="Beneficio Destacado 2" value={selectedProduct.shopifyContent.highlightBenefit2} />
                <FieldDisplay label="Beneficio Destacado 3" value={selectedProduct.shopifyContent.highlightBenefit3} />
                <FieldDisplay label="Beneficio Destacado 4" value={selectedProduct.shopifyContent.highlightBenefit4} />
                <FieldDisplay label="Beneficio Destacado 5" value={selectedProduct.shopifyContent.highlightBenefit5} />
                {selectedProduct.shopifyContent.faqs?.map((faq, i) => (
                    <React.Fragment key={i}>
                        <FieldDisplay label={`FAQ ${i+1} - Pregunta`} value={faq.question} />
                        <FieldDisplay label={`FAQ ${i+1} - Respuesta`} value={faq.answer} />
                    </React.Fragment>
                ))}
                <FieldDisplay label="Posts Relacionados" value={selectedProduct.shopifyContent.relatedPosts?.map(p => p.title)} />
            </CollapsibleSection>
            )}

            {selectedProduct.layer2Content && (
            <CollapsibleSection title="Contenido Layer2">
                <FieldDisplay label="Título Final (ES)" value={selectedProduct.layer2Content.title.spanishContent.finalVersion} />
                <FieldDisplay label="Descripción Final (ES)" value={selectedProduct.layer2Content.description.spanishContent.finalVersion} />
                {selectedProduct.layer2Content.title.translations.map(t => (
                    <FieldDisplay key={t.lang} label={`Título (${t.lang})`} value={t.finalVersion} />
                ))}
                {selectedProduct.layer2Content.description.translations.map(t => (
                    <FieldDisplay key={t.lang} label={`Descripción (${t.lang})`} value={t.finalVersion} />
                ))}
            </CollapsibleSection>
            )}
            
            {Object.entries(activeAmazonContentByCountry).map(([iso, content]) => {
                const version = content?.versions.find(v => v.versionId === content.currentVersionId);
                if (!version) return null;
                return (
                    <CollapsibleSection key={iso} title={`Contenido Amazon (${iso})`}>
                        <FieldDisplay label="Título" value={version.content.title} />
                        <FieldDisplay label="Descripción" value={version.content.description} isHtml />
                        {version.content.bulletPoints.map((bp, i) => (
                             <FieldDisplay key={i} label={`Bullet ${i+1}`} value={bp.text} />
                        ))}
                         <FieldDisplay label="Términos Búsqueda" value={version.content.searchTerms} />
                         <FieldDisplay label="Backend Keywords" value={version.content.backendKeywords} />
                    </CollapsibleSection>
                )
            })}
             <CollapsibleSection title="Atributos Amazon">
                {selectedProduct.amazonAttributes && Object.keys(selectedProduct.amazonAttributes).length > 0 ? (
                    Object.entries(selectedProduct.amazonAttributes).map(([key, value]) => (
                        <FieldDisplay key={key} label={key} value={value} />
                    ))
                ) : (
                    <div className="text-xs text-slate-500 p-2">No hay atributos de Amazon definidos para este producto.</div>
                )}
             </CollapsibleSection>
        </div>
      );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-8 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg z-40 max-h-[80vh] flex flex-col">
      <div className="p-3 border-b border-slate-700 flex justify-between items-center flex-shrink-0 cursor-move">
        <h3 className="text-base font-semibold text-slate-200 flex items-center">
            <Icon name="box-open" className="mr-2 text-indigo-400"/>
            Inspector de Producto
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
      </div>

        {selectedProduct ? (
            <>
                <div className="p-3 flex justify-between items-center flex-shrink-0 border-b border-slate-700">
                    <button onClick={handleBackToSearch} className="text-sm text-cyan-400 hover:underline">
                        <Icon name="arrow-left" className="mr-2"/> Volver a la Búsqueda
                    </button>
                    <h4 className="font-bold text-slate-200 truncate">{selectedProduct.name}</h4>
                </div>
                <div className="p-3 space-y-2 overflow-y-auto">
                    {renderProductDetails()}
                </div>
            </>
        ) : (
            <>
                <div className="p-3 flex-shrink-0">
                    <TextInput 
                        placeholder="Buscar producto por Nombre o SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="p-3 space-y-2 overflow-y-auto">
                    {filteredProducts.map(product => (
                        <div key={product.id} onClick={() => handleSelectProduct(product)}
                            className="p-2 bg-slate-700/50 rounded-md hover:bg-slate-700 cursor-pointer"
                        >
                            <p className="font-semibold text-slate-200">{product.name}</p>
                        </div>
                    ))}
                </div>
            </>
        )}
    </div>
  );
};