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
exports.LoginView = void 0;
const react_1 = __importStar(require("react"));
const TextInput_1 = require("../components/common/TextInput");
const CompanyLogo = () => (<svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-white">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="3" fill="none"/>
        <path d="M84 43 L65 49 L58 35 L30 15 L16 43 L33 49 L38 60 L22 65 L45 90 L68 70 L50 65 L62 56 L58 42 L40 46 L36 43 M65 49 L58 42 M58 35 L65 49 M30 15 L58 35 M30 15 L33 49 M16 43 L33 49 M33 49 L38 60 M38 60 L68 70 M50 65 L62 56 M36 43 L58 42 M36 43 L33 49 M58 42 L65 49 M38 60 L50 65" stroke="currentColor" strokeWidth="3" fill="none"/>
    </svg>);
const LoginView = ({ onLogin, users }) => {
    const adminUser = users.find(u => u.role === 'Administrador');
    const [email, setEmail] = (0, react_1.useState)(adminUser?.email || '');
    const [password, setPassword] = (0, react_1.useState)(adminUser?.password || '');
    const [error, setError] = (0, react_1.useState)('');
    const handleSubmit = (e) => {
        e.preventDefault();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            onLogin(user);
        }
        else {
            setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-slate-800 shadow-lg rounded-lg p-8 space-y-6 border border-slate-700">
            <div className="text-center">
                <div className="inline-block">
                    <CompanyLogo />
                </div>
                <h1 className="text-2xl font-bold text-slate-200 mt-2">Bienvenido a PIM</h1>
                <p className="text-slate-400">Inicia sesión para continuar</p>
            </div>
          
            {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
          
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <TextInput_1.TextInput type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@email.com"/>
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                <TextInput_1.TextInput type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"/>
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 font-semibold">
                Iniciar Sesión
            </button>
        </form>
      </div>
    </div>);
};
exports.LoginView = LoginView;
