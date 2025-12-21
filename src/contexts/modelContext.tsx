import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import type { SupportedModelsResult } from "../api/types";
import { modelService } from "../api/services/modelService";

interface ModelsContextType {
  models: SupportedModelsResult | null;
  loading: boolean;
  error: boolean;
  refetch: () => Promise<void>;
}

const ModelsContext = createContext<ModelsContextType | undefined>(undefined);

interface ModelsProviderProps {
  children: ReactNode;
}

export function ModelsProvider({ children }: ModelsProviderProps) {
  const [models, setModels] = useState<SupportedModelsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await modelService.supportModels();
      setModels(result);
      if (!result.success) {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <ModelsContext.Provider
      value={{
        models,
        loading,
        error,
        refetch: fetchModels,
      }}
    >
      {children}
    </ModelsContext.Provider>
  );
}

export function useModels() {
  const context = useContext(ModelsContext);
  if (context === undefined) {
    throw new Error("useModels must be used within a ModelsProvider");
  }
  return context;
}
