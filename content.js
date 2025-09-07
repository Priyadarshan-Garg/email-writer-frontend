
function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote'
    ];

    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '.gU.Up',
        '[role="toolbar"]'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

function createPromptInput() {
    const textarea = document.createElement('textarea');
    textarea.placeholder = "Type your instruction (optional). Leave content empty to generate from instruction only.";
    textarea.className = 'email-writer-prompt-input';
    textarea.style.width = '100%';
    textarea.style.minHeight = '60px';
    textarea.style.border = '1px solid #ccc';
    textarea.style.borderRadius = '4px';
    textarea.style.padding = '8px';
    textarea.style.marginBottom = '8px';
    textarea.style.resize = 'vertical';
    return textarea;
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) return;

    const toolbar = findComposeToolbar();
    if (!toolbar) return;

    const promptInput = createPromptInput();
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        button.innerHTML = 'Generating...';
        button.setAttribute('disabled', '');

        try {

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            const instructionInput = document.querySelector('.email-writer-prompt-input');
            const toolbar = findComposeToolbar() || composeBox?.parentElement;

            const instruction = instructionInput ? instructionInput.value.trim() : '';
            let emailContent = composeBox ? composeBox.innerText.trim() : '';

            if (emailContent.length === 0) {
                emailContent = getEmailContent();
            }

            // Allow instruction-only requests (content can be empty). Require at least one of them to be non-empty.
            if (emailContent.length === 0 && instruction.length === 0) {
                alert("Please provide an instruction or type some email content.");
                button.innerHTML = 'AI Reply';
                button.removeAttribute('disabled');
                return;
            }

            const requestBody = {
                emailContent: emailContent,
                instruction: instruction,
                tone: "professional"
            };
            console.log("Sending request:", requestBody);

            // Helper to try multiple payload shapes in case the backend expects different keys
            async function sendGenerateRequest(baseUrl, payloads) {
                let lastErrorText = '';
                for (let i = 0; i < payloads.length; i++) {
                    const p = payloads[i];
                    try {
                        console.log(`Attempt ${i + 1} with payload keys: ${Object.keys(p).join(', ')}`);
                        const resp = await fetch(baseUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'text/plain, */*;q=0.8'
                            },
                            body: JSON.stringify(p),
                            // Explicit CORS mode; Chrome default is fine but being explicit is harmless
                            mode: 'cors',
                            credentials: 'omit'
                        });
                        console.log("Response status:", resp.status);
                        if (resp.ok) return resp;
                        const txt = await resp.text();
                        lastErrorText = `HTTP ${resp.status} with payload ${JSON.stringify(p).slice(0, 200)} => ${txt}`;
                        // Retry on 400/415 with next shape; otherwise throw immediately
                        if (resp.status !== 400 && resp.status !== 415 && resp.status !== 422) {
                            throw new Error(lastErrorText);
                        }
                    } catch (e) {
                        lastErrorText = (e && e.message) ? e.message : String(e);
                        // continue to next payload
                    }
                }
                throw new Error(lastErrorText || 'All payload attempts failed');
            }

            const url = 'https://email-writer-backend-7dlb.onrender.com/api/email/generate';
            const promptCombined = [instruction, emailContent].filter(Boolean).join('\n\n---\n\n');
            const payloadAttempts = [
                requestBody,
                {content: emailContent, instruction: instruction, tone: 'professional'},
                {text: emailContent, prompt: instruction, tone: 'professional'},
                {message: emailContent, instruction: instruction, tone: 'professional'},
                {prompt: promptCombined, tone: 'professional'}
            ];

            const response = await sendGenerateRequest(url, payloadAttempts);

            // Backend returns plain text. Read as text directly.
            const generatedReply = (await response.text()).trim();

            if (!generatedReply || generatedReply.length === 0) {
                throw new Error('Empty reply from API');
            }

            console.log("Generated reply:", generatedReply);
            if (composeBox) {
                composeBox.innerHTML = '';
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('Compose box was not found');
            }

        } catch (error) {
            console.error(error);
            const msg = (error && error.message) ? error.message : String(error);
            alert('Failed to generate reply: ' + msg);
        } finally {
            button.innerHTML = 'AI Reply';
            button.removeAttribute('disabled');
        }
    });

    toolbar.insertBefore(promptInput, toolbar.firstChild);
    toolbar.insertBefore(button, promptInput);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if (hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});