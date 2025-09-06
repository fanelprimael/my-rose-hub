import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { useSchoolYearsContext } from "@/contexts/SchoolYearsContext";

interface SchoolYearSelectorProps {
  onYearChange?: (yearId: string) => void;
  showCurrentBadge?: boolean;
}

export const SchoolYearSelector = ({ onYearChange, showCurrentBadge = true }: SchoolYearSelectorProps) => {
  const { schoolYears, selectedSchoolYear, setSelectedSchoolYear, currentSchoolYear } = useSchoolYearsContext();

  const handleYearChange = (yearId: string) => {
    const year = schoolYears.find(y => y.id === yearId);
    setSelectedSchoolYear(year || null);
    onYearChange?.(yearId);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Année scolaire:</span>
      </div>
      
      <Select 
        value={selectedSchoolYear?.id || ''} 
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sélectionner une année" />
        </SelectTrigger>
        <SelectContent>
          {schoolYears.map((year) => (
            <SelectItem key={year.id} value={year.id}>
              <div className="flex items-center gap-2">
                {year.name}
                {year.is_current && showCurrentBadge && (
                  <Badge variant="default" className="ml-2 text-xs">
                    Courante
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedSchoolYear && (
        <div className="flex items-center gap-2">
          <Badge 
            variant={selectedSchoolYear.is_current ? "default" : "outline"}
            className="text-xs"
          >
            {selectedSchoolYear.name}
          </Badge>
          {selectedSchoolYear.is_current && showCurrentBadge && (
            <Badge variant="secondary" className="text-xs">
              Année Courante
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};