import React, { useState } from 'react';
import { 
  Printer, 
  Share2, 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check,
  FileText
} from 'lucide-react';
import { WorkOrder, CompanyProfile } from '../types/os';
import { 
  formatCurrency, 
  formatDate, 
  formatDateTime, 
  formatDocument, 
  formatPhone, 
  getStatusMeta, 
  getPriorityMeta, 
  getPaymentMethodLabel,
  buildWhatsAppMessage,
  getWhatsAppLink
} from '../utils/formatters';

interface OrderPrintViewProps {
  order: WorkOrder;
  company: CompanyProfile;
  onBack: () => void;
  onEdit: () => void;
}

export const OrderPrintView: React.FC<OrderPrintViewProps> = ({
  order,
  company,
  onBack,
  onEdit
}) => {
  const [printMode, setPrintMode] = useState<'complete' | 'client_entry' | 'budget'>('complete');
  const [copiedPix, setCopiedPix] = useState(false);
  const statusMeta = getStatusMeta(order.status);
  const priorityMeta = getPriorityMeta(order.priority);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = buildWhatsAppMessage(order, company);
    const link = getWhatsAppLink(order.client.phone || order.client.whatsapp || '', text);
    window.open(link, '_blank');
  };

  const handleCopyPix = () => {
    if (company.pixKey) {
      navigator.clipboard.writeText(company.pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    }
  };

  // QR Code URL for quick PIX payment simulation (using quickchart or static data)
  const qrCodeUrl = company.pixKey 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(company.pixKey)}`
    : null;

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-3 sm:px-6">
      {/* Top Floating Action Bar (Hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 no-print">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition px-3 py-2 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Ordens
          </button>

          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setPrintMode('complete')}
              className={`px-3 py-1.5 rounded-lg transition ${printMode === 'complete' ? 'bg-white shadow-xs font-bold text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Via Completa (A4)
            </button>
            <button
              onClick={() => setPrintMode('budget')}
              className={`px-3 py-1.5 rounded-lg transition ${printMode === 'budget' ? 'bg-white shadow-xs font-bold text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Orçamento Comercial
            </button>
            <button
              onClick={() => setPrintMode('client_entry')}
              className={`px-3 py-1.5 rounded-lg transition ${printMode === 'client_entry' ? 'bg-white shadow-xs font-bold text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Comprovante de Entrada
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar OS
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              Enviar no WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition"
            >
              <Printer className="w-4 h-4" />
              Imprimir A4 / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Official Printable Sheet Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-8 sm:p-10 print-container text-slate-800 leading-tight">
        {/* HEADER SECTION */}
        <header className="border-b-2 border-slate-900 pb-5 mb-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Company Info */}
            <div className="flex items-start gap-4">
              {company.logoUrl ? (
                <img 
                  src={company.logoUrl} 
                  alt={company.name} 
                  className="w-16 h-16 object-contain rounded-lg border border-slate-200 p-1"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
                  {company.tradeName ? company.tradeName.slice(0, 2).toUpperCase() : 'OS'}
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  {company.tradeName || company.name}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  {company.name !== company.tradeName && `${company.name} • `}
                  CNPJ: {formatDocument(company.document)}
                  {company.ie ? ` • IE: ${company.ie}` : ''}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {company.address}, {company.number}{company.complement ? ` - ${company.complement}` : ''} • {company.neighborhood} • {company.city}/{company.state} • CEP {company.zipCode}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 font-semibold mt-1">
                  <span>Tel: {formatPhone(company.phone)}</span>
                  <span>WhatsApp: {formatPhone(company.whatsapp)}</span>
                  <span>{company.email}</span>
                </div>
              </div>
            </div>

            {/* Document Box */}
            <div className="text-right sm:border-l-2 sm:border-slate-300 sm:pl-6 self-stretch flex flex-col justify-center min-w-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {printMode === 'budget' ? 'ORÇAMENTO COMERCIAL' : printMode === 'client_entry' ? 'COMPROVANTE DE ENTRADA' : 'ORDEM DE SERVIÇO'}
              </span>
              <div className="text-2xl font-black font-mono tracking-tight text-blue-600">
                {order.number}
              </div>
              <div className="mt-1 flex items-center justify-end gap-1.5">
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${statusMeta.bg} border`}>
                  {statusMeta.label}
                </span>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium uppercase ${priorityMeta.badge}`}>
                  {priorityMeta.label}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Emissão: {formatDateTime(order.createdAt)}
              </div>
            </div>
          </div>
        </header>

        {/* METADATA BAR (Datas & Técnico) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs mb-5">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Data de Abertura</span>
            <span className="font-semibold text-slate-800">{formatDate(order.createdAt)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Previsão de Entrega</span>
            <span className="font-semibold text-slate-800">{formatDate(order.scheduledDate) || 'A combinar'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Data de Conclusão</span>
            <span className="font-semibold text-slate-800">{formatDate(order.completedDate) || '-'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Técnico Responsável</span>
            <span className="font-semibold text-slate-800 truncate block">{order.technicianName || 'Equipe Técnica'}</span>
          </div>
        </div>

        {/* CLIENT DETAILS */}
        <section className="mb-5 border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>👤</span> DADOS DO CLIENTE
            </h2>
            {order.client.id && (
              <span className="text-[10px] font-mono text-slate-500">Cód: {order.client.id}</span>
            )}
          </div>
          <div className="p-3 text-xs grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4">
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Nome / Razão Social:</span>
              <span className="text-sm font-bold text-slate-900">{order.client.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">CPF / CNPJ:</span>
              <span className="font-semibold font-mono text-slate-800">{formatDocument(order.client.document) || 'Não informado'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Telefone / WhatsApp:</span>
              <span className="font-semibold text-slate-800">{formatPhone(order.client.phone) || '-'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">E-mail:</span>
              <span className="font-semibold text-slate-800 truncate block">{order.client.email || 'Não informado'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Cidade / UF / CEP:</span>
              <span className="font-semibold text-slate-800">
                {order.client.city || '-'}/{order.client.state || '-'} {order.client.zipCode ? `• CEP: ${order.client.zipCode}` : ''}
              </span>
            </div>
            {order.client.address && (
              <div className="sm:col-span-3">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Endereço de Atendimento / Faturamento:</span>
                <span className="font-medium text-slate-800">{order.client.address}</span>
              </div>
            )}
          </div>
        </section>

        {/* EQUIPMENT / OBJECT UNDER SERVICE */}
        <section className="mb-5 border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>🔧</span> OBJETO / EQUIPAMENTO DO ATENDIMENTO
            </h2>
          </div>
          <div className="p-3 text-xs grid grid-cols-1 sm:grid-cols-4 gap-y-2 gap-x-4">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Categoria:</span>
              <span className="font-semibold text-slate-800">{order.equipment.type || 'Geral'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Marca:</span>
              <span className="font-semibold text-slate-800">{order.equipment.brand || '-'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Modelo:</span>
              <span className="font-semibold text-slate-800">{order.equipment.model || '-'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Série / Chassi / Placa:</span>
              <span className="font-mono font-semibold text-slate-800">{order.equipment.serialNumberOrPlate || 'N/A'}</span>
            </div>

            {order.equipment.accessories && (
              <div className="sm:col-span-4 bg-slate-50 p-2 rounded border border-slate-200/80">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Acessórios / Cabos / Peças que acompanham:</span>
                <span className="font-medium text-slate-800">{order.equipment.accessories}</span>
              </div>
            )}

            {order.equipment.visualCondition && (
              <div className="sm:col-span-4 bg-slate-50 p-2 rounded border border-slate-200/80">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Estado Visual / Avarias Pré-existentes na Recepção:</span>
                <span className="font-medium text-slate-800">{order.equipment.visualCondition}</span>
              </div>
            )}

            <div className="sm:col-span-2 bg-amber-50/70 p-2.5 rounded border border-amber-200">
              <span className="text-amber-800 block text-[10px] uppercase font-bold flex items-center gap-1">
                <span>⚠️</span> Defeito Relatado pelo Cliente:
              </span>
              <p className="text-slate-800 font-medium mt-0.5 leading-snug">
                {order.equipment.reportedDefect || 'Não relatado.'}
              </p>
            </div>

            <div className="sm:col-span-2 bg-blue-50/70 p-2.5 rounded border border-blue-200">
              <span className="text-blue-800 block text-[10px] uppercase font-bold flex items-center gap-1">
                <span>🔍</span> Diagnóstico Técnico & Laudo Pericial:
              </span>
              <p className="text-slate-800 font-medium mt-0.5 leading-snug">
                {order.equipment.technicalDiagnosis || 'Diagnóstico em elaboração ou conforme itens abaixo.'}
              </p>
            </div>
          </div>
        </section>

        {/* SERVICES AND PARTS TABLE */}
        <section className="mb-5 border border-slate-200 rounded-lg overflow-hidden page-break-avoid">
          <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>📋</span> DISCRIMINAÇÃO DOS SERVIÇOS EXECUTADOS E PEÇAS / MATERIAIS
            </h2>
            <span className="text-[10px] text-slate-500 font-semibold">{order.items?.length || 0} item(ns)</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-200">
                <th className="py-2 px-3 w-12 text-center">Item</th>
                <th className="py-2 px-2 w-16 text-center">Tipo</th>
                <th className="py-2 px-3">Descrição Detalhada do Serviço / Peça</th>
                <th className="py-2 px-2 w-16 text-center">Qtd</th>
                <th className="py-2 px-3 w-24 text-right">Valor Unit.</th>
                <th className="py-2 px-3 w-20 text-right">Desc.</th>
                <th className="py-2 px-3 w-28 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-center font-mono text-slate-500">{String(idx + 1).padStart(2, '0')}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        item.type === 'service' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.type === 'service' ? 'Serviço' : 'Peça'}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800">
                      <div>{item.description}</div>
                      {item.code && <span className="text-[10px] font-mono text-slate-400">Cód: {item.code}</span>}
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-semibold">{item.quantity}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-500">
                      {item.discount > 0 ? `-${formatCurrency(item.discount)}` : '-'}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{formatCurrency(item.total)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-slate-400 italic">
                    Nenhum item adicionado a esta ordem de serviço.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* FINANCIAL SUMMARY & PIX PAYMENT BOX */}
        <section className="mb-5 grid grid-cols-1 sm:grid-cols-12 gap-4 page-break-avoid">
          {/* PIX / Payment Instructions (7 cols) */}
          <div className="sm:col-span-7 border border-slate-200 rounded-lg p-3.5 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  CONDIÇÕES DE PAGAMENTO & PIX
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-200 text-slate-800">
                  {order.financial.paymentStatus === 'paid' ? 'QUITADO' : 'AGUARDANDO PAGAMENTO'}
                </span>
              </div>

              <div className="flex items-start gap-4">
                {qrCodeUrl && (
                  <div className="bg-white p-1.5 rounded-lg border border-slate-300 shrink-0">
                    <img src={qrCodeUrl} alt="QR Code PIX" className="w-20 h-20" />
                  </div>
                )}
                <div className="text-xs space-y-1">
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Forma Escolhida: </span>
                    {getPaymentMethodLabel(order.financial.paymentMethod)}
                    {order.financial.installmentsCount && order.financial.installmentsCount > 1 
                      ? ` em ${order.financial.installmentsCount}x de ${formatCurrency(order.financial.total / order.financial.installmentsCount)}` 
                      : ''}
                  </div>

                  {company.pixKey && (
                    <div className="mt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Chave PIX da Empresa:</span>
                      <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2 py-1 font-mono text-xs font-bold text-blue-700">
                        <span>{company.pixKey}</span>
                        <button
                          onClick={handleCopyPix}
                          className="no-print p-0.5 hover:text-blue-900 transition"
                          title="Copiar Chave PIX"
                        >
                          {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {company.defaultNotes && (
                    <p className="text-[10px] text-slate-500 italic mt-1">{company.defaultNotes}</p>
                  )}
                </div>
              </div>
            </div>

            {order.clientNotes && (
              <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold text-slate-700">Observações adicionais: </span>
                {order.clientNotes}
              </div>
            )}
          </div>

          {/* Totals Breakdown (5 cols) */}
          <div className="sm:col-span-5 border-2 border-slate-900 rounded-lg p-3 bg-white flex flex-col justify-between">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Serviços:</span>
                <span className="font-mono font-medium">{formatCurrency(order.financial.servicesSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Peças:</span>
                <span className="font-mono font-medium">{formatCurrency(order.financial.partsSubtotal)}</span>
              </div>
              {order.financial.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Desconto Concedido:</span>
                  <span className="font-mono">-{formatCurrency(order.financial.discount)}</span>
                </div>
              )}
              {order.financial.additionalFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Taxa Deslocamento / Outros:</span>
                  <span className="font-mono">+{formatCurrency(order.financial.additionalFee)}</span>
                </div>
              )}
            </div>

            <div className="border-t-2 border-slate-900 pt-2 mt-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-extrabold uppercase text-slate-800">TOTAL GERAL:</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-950">
                  {formatCurrency(order.financial.total)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* WARRANTY & LEGAL TERMS */}
        <section className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-600 leading-normal page-break-avoid">
          <div className="flex items-center gap-1 font-bold text-slate-800 uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            TERMO DE GARANTIA E CONDIÇÕES LEGAIS (GARANTIA DE {order.warrantyDays || 90} DIAS)
          </div>
          <p>
            {order.warrantyTerms || company.defaultWarrantyTerms}
          </p>
          <p className="mt-1 font-medium text-slate-700">
            * O cliente declara para os devidos fins que autorizou a execução dos serviços acima discriminados e confere a integridade do equipamento entregue/recebido.
          </p>
        </section>

        {/* SIGNATURE FIELDS */}
        <section className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-300 page-break-avoid">
          {/* Client Signature */}
          <div className="text-center flex flex-col items-center justify-end min-h-[90px]">
            {order.signatures?.clientSignature ? (
              <img 
                src={order.signatures.clientSignature} 
                alt="Assinatura do Cliente" 
                className="max-h-16 mb-1 object-contain"
              />
            ) : (
              <div className="h-14"></div>
            )}
            <div className="w-full border-t border-slate-900 pt-1">
              <p className="text-xs font-bold text-slate-900 uppercase">
                {order.signatures?.clientSignerName || order.client.name}
              </p>
              <p className="text-[10px] text-slate-500">
                Assinatura do Cliente / Responsável
                {order.signatures?.signedAt ? ` • Assinado em ${formatDate(order.signatures.signedAt)}` : ''}
              </p>
            </div>
          </div>

          {/* Technician / Company Signature */}
          <div className="text-center flex flex-col items-center justify-end min-h-[90px]">
            {order.signatures?.technicianSignature ? (
              <img 
                src={order.signatures.technicianSignature} 
                alt="Assinatura do Responsável" 
                className="max-h-16 mb-1 object-contain"
              />
            ) : (
              <div className="h-14"></div>
            )}
            <div className="w-full border-t border-slate-900 pt-1">
              <p className="text-xs font-bold text-slate-900 uppercase">
                {order.technicianName || company.tradeName || company.name}
              </p>
              <p className="text-[10px] text-slate-500">
                Assinatura do Técnico / Empresa Responsável
              </p>
            </div>
          </div>
        </section>

        {/* Print Timestamp Footer */}
        <footer className="mt-8 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400">
          Documento emitido eletronicamente via Sistema Gerador de OS Comercial • {order.number} • Data de Impressão: {formatDateTime(new Date().toISOString())}
        </footer>
      </div>
    </div>
  );
};
