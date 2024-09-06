// Importando o SDK
const { KommoAPI } = require('kommo-web-sdk');

const api = new KommoAPI({
    onReady: () => {
        // Configuração do evento de criação ou atualização de contato
        subscribeToContactChanges();
    }
});

// Função para se inscrever nas mudanças de contato
function subscribeToContactChanges() {
    api.events.on('contact.created', (contact) => handleContactChange(contact));
    api.events.on('contact.updated', (contact) => handleContactChange(contact));
}

function handleContactChange(contact) {
    // Obtenha o ID do contato
    const contactId = contact.id;

    // Obtenha o campo "phone work"
    const phoneWork = contact.custom_fields.find(field => field.name === 'phone.work');

    if (phoneWork) {
        const phoneWorkId = phoneWork.id;
        const phoneWorkValue = phoneWork.values[0].value; // Assumindo que é um array
        
        // Enviar os dados para o webhook
        sendToWebhook(contactId, phoneWorkId, phoneWorkValue);
    }
}

function sendToWebhook(contactId, phoneWorkId, phoneWorkValue) {
    const webhookUrl = 'https://hook.us2.make.com/12jgqn583kl6aolp13dbfgkyarbdo5dv'; // Substitua pelo seu URL de webhook

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contactId: contactId,
            phoneWorkId: phoneWorkId,
            phoneWorkValue: phoneWorkValue
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao enviar dados para o webhook');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados enviados com sucesso:', data);
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error);
    });
}