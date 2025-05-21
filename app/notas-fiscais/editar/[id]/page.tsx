import FormNotaFiscalPage from "../../form";

export default function EditarPage({ params }: { params: { id: string } }) {
  // Mock data for the invoice - in a real app, you would fetch this from an API
  const notaFiscal = {
    id: Number.parseInt(params.id),
    number: "NF-e 000001",
    company: "Empresa ABC Ltda",
    date: "15/04/2023",
    value: "R$ 1.250,00",
    status: "Emitida",
    items: [
      {
        description: "Serviço de consultoria",
        quantity: "10",
        unitPrice: "125,00",
      },
    ],
  };

  return <FormNotaFiscalPage notaFiscal={notaFiscal} />;
}
