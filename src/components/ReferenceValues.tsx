
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info } from "lucide-react";
import { referenceValues } from "@/utils/bodyCompositionCalculator";

interface ReferenceValuesProps {
  gender?: 'male' | 'female';
}

const ReferenceValues = ({ gender = 'male' }: ReferenceValuesProps) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Valori di Riferimento
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Massa Grassa */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Massa Grassa (%)</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Maschi</TableHead>
                  <TableHead>Femmine</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Molto Basso</TableCell>
                  <TableCell className="text-blue-600">{'< 10%'}</TableCell>
                  <TableCell className="text-blue-600">{'< 16%'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Normale</TableCell>
                  <TableCell className="text-green-600">10% - 20%</TableCell>
                  <TableCell className="text-green-600">16% - 30%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Alto</TableCell>
                  <TableCell className="text-yellow-600">20% - 25%</TableCell>
                  <TableCell className="text-yellow-600">30% - 35%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Molto Alto</TableCell>
                  <TableCell className="text-red-600">{'> 25%'}</TableCell>
                  <TableCell className="text-red-600">{'> 35%'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* BMI */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">BMI (kg/m²)</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valore</TableHead>
                  <TableHead>Descrizione</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Sottopeso</TableCell>
                  <TableCell className="text-blue-600">{'< 18.5'}</TableCell>
                  <TableCell>Peso insufficiente</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Normopeso</TableCell>
                  <TableCell className="text-green-600">18.5 - 24.9</TableCell>
                  <TableCell>Peso normale</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sovrappeso</TableCell>
                  <TableCell className="text-yellow-600">25.0 - 29.9</TableCell>
                  <TableCell>Eccesso ponderale</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Obesità</TableCell>
                  <TableCell className="text-red-600">{'≥ 30.0'}</TableCell>
                  <TableCell>Obesità</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Rapporti Diagnostici */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Rapporti Diagnostici</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parametro</TableHead>
                  <TableHead>Valori Normali</TableHead>
                  <TableHead>Significato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">TBW/FFM</TableCell>
                  <TableCell className="text-green-600">0.70 - 0.75</TableCell>
                  <TableCell>Idratazione tissutale</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">ECW/ICW</TableCell>
                  <TableCell className="text-green-600">0.60 - 0.70</TableCell>
                  <TableCell>Stato di idratazione</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Grasso Viscerale</TableCell>
                  <TableCell className="text-green-600">1 - 9</TableCell>
                  <TableCell>Rischio metabolico</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Note Interpretative */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Note Interpretative</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• TBW/FFM elevato può indicare ritenzione idrica</li>
              <li>• ECW/ICW elevato suggerisce edema o infiammazione</li>
              <li>• I valori devono essere interpretati nel contesto clinico</li>
              <li>• Le variazioni individuali sono normali</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferenceValues;
