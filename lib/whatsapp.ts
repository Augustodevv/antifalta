// Envio via Evolution API. Troque pelo provedor oficial sem mudar o resto.
export async function sendWhats(phone: string, message: string) {
  const res = await fetch(
    `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.EVOLUTION_API_KEY!,
      },
      body: JSON.stringify({ number: phone, text: message }),
    }
  );
  if (!res.ok) throw new Error(`WhatsApp fail: ${await res.text()}`);
}

export const reminderMsg = (name: string, shop: string, when: string, id: string) =>
  `Olá ${name}! Aqui é ${shop}. Seu horário é ${when}.\nResponda:\n1 = CONFIRMAR\n2 = CANCELAR\nProtocolo ${id.slice(0, 6)}`;
