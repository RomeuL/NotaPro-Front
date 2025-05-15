import { Phone } from "lucide-react";
import FormEmpresaPage from "../../form";

export default function EditarPage() {
  const empresa = {
    id: 1,
    name: "Empresa ABC Ltda",
    cnpj: "12.345.678/0001-90",
    address: "Av. Paulista, 1000, São Paulo - SP",
    city: "Mossoró",
    phone: "84987077675",
    email: "pedrolucasamorim2001@hotmail.com",
    state: "RN",
  }; //mock da requisição
  return <FormEmpresaPage empresa={empresa} />;
}
