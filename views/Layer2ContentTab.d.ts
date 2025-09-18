import { FC } from 'react';
import { Product, AppData, Layer2Content } from '../types';
interface Layer2ContentTabProps {
    product: Product;
    appData: AppData;
    onContentChange: (content: Layer2Content) => void;
}
export declare const Layer2ContentTab: FC<Layer2ContentTabProps>;
export {};
