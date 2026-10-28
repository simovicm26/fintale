(() => {
  'use strict';
  const key = 'modelquest.chapter1.v2';
  const fresh = () => ({ step: 0, funded: false, recorded: false, earned: false, delivered: false, machine: false, invoice: false, cashCheck: false, equation: false, practice: false, completed: false });
  let memory = fresh();
  let storageAvailable = true;
  try { const saved = JSON.parse(localStorage.getItem(key)); if (saved && Number.isInteger(saved.step) && saved.step >= 0 && saved.step <= 15) for (const k of Object.keys(memory)) { if (typeof saved[k] === typeof memory[k]) memory[k] = saved[k]; } } catch { storageAvailable = false; }
  let selected = false, feedback = '', error = false, signup = false;
  let activeCard = '', equationSlots = {}, lastFeedback = ''; 
  const root = document.querySelector('#app');
  let feedbackStep = 0;
  let workshopStatus = 'loading', workshopRetry = 0;
  const feedbackAnswers = { liked: '', improve: '', next: '', accounting: '' };
  const signupEndpoint = "https://8f7239dd.sibforms.com/serve/MUIFAEZPeoasbx3zdwJBhHbqUCK8nm3TdGlQxpqs0eeofTFy5Ff8nqGRQRAq3GRvaLjEfRYnKb9wmqcCAi-0teEPSmfsrvVjqhgXDuRufoB2r95Eupu0g9Lx67hOflY0IAw9VrYMAnSMkVydwUpm2seni2Qo--X2F1QJ7GAnL0LKOqPCxzOFayEfG5YGtOj5jNQp1O7Urdln4Q0Lfg==";
  const submissionDraftKey = 'fintale.submissionDraft.v1';
  const feedbackDraftKey = 'fintale.feedbackDraft.v1';
  let feedbackSending = false, feedbackError = '', feedbackSent = '', feedbackRequestId = '', feedbackRequestBody = '';
  let signupCompleted = false;
  try { signupCompleted=sessionStorage.getItem('fintale.signupCompleted.v1')==='1'; } catch {}
  let restoredEmail = '';
  function feedbackFingerprint() { return JSON.stringify(feedbackAnswers); }
  function keepFeedbackDraft() { try { sessionStorage.setItem(feedbackDraftKey,JSON.stringify({answers:feedbackAnswers,step:feedbackStep,sent:feedbackSent,requestId:feedbackRequestId,requestBody:feedbackRequestBody})); } catch {} }
  try { const draft=JSON.parse(sessionStorage.getItem(feedbackDraftKey)); if(memory.step===15 && draft){for(const name of Object.keys(feedbackAnswers))feedbackAnswers[name]=String(draft.answers?.[name]||'').slice(0,500);feedbackStep=Number.isInteger(draft.step)?Math.max(0,Math.min(5,draft.step)):0;feedbackSent=String(draft.sent||'');feedbackRequestId=String(draft.requestId||'');feedbackRequestBody=String(draft.requestBody||'');signup=true;} } catch {}
  try { const draft=JSON.parse(sessionStorage.getItem(submissionDraftKey)); if(memory.step===15 && draft){if(!feedbackSent)for(const name of Object.keys(feedbackAnswers))feedbackAnswers[name]=String(draft.answers?.[name]||'').slice(0,500);restoredEmail=String(draft.email||'').slice(0,254);signup=true;feedbackStep=4;} } catch {}
  if(new URLSearchParams(window.location?.search||'').get('feedback')==='1') { memory.step=15;signup=true;feedbackStep=feedbackSent===feedbackFingerprint()?5:0;save();try{window.history?.replaceState(null,'',window.location.pathname);}catch{} }
  const feedbackQuestions = [
    {key:'liked', title:'What did you<br><em>like?</em>', label:'What did you like?', help:'Was there a moment, interaction or explanation you enjoyed?', placeholder:'Tell us what worked for you…'},
    {key:'improve', title:'What could<br><em>be better?</em>', label:'What didn’t work for you?', help:'Anything confusing, frustrating or missing? We’d love to know.', placeholder:'Tell us what didn’t work…'},
    {key:'next', title:'Where should we<br><em>explore next?</em>', label:'What finance or economics topics would you like to learn?', help:'Think beyond accounting: personal finance, investing, how businesses are valued, inflation or how the economy works. What interests you?', placeholder:'I’d love a course about…'},
    {key:'accounting', title:'What’s next<br><em>in accounting?</em>', label:'Which financial accounting chapters would you like next?', help:'For example: revenue and expenses, debits and credits, financial statements, cash flow, inventory or depreciation. What would help you most?', placeholder:'I’d like to understand…'}
  ];
  const tips = [
    'You are the owner of this fictional workshop. All amounts are imaginary. We leave taxes and other complications for later chapters.',
    'We are tracking the business’s records. Moving €1,000 from you to the business gives the business cash. It does not mean the business earned revenue.',
    'An asset is a resource the business controls. Here, “cash” includes money in the business bank account. The €1,000 is the same money you just contributed.',
    'Owner capital records your contribution as the owner. It is part of equity: the owner’s interest in the business. We will build on that idea later. This is an owner contribution, not a loan.',
    'A bank balance tells you how much cash the business has. Revenue comes from earning payment through business activity, such as completing a repair. Owner contributions are not revenue.',
    'These cards describe one event from two angles: cash is what the business received; owner capital records your contribution. €1,000 + €1,000 is not €2,000 of money.',
    'Accepting the delivery is one new story event. The business receives equipment costing €600 and owes Sam €600. The invoice is payable next month; no cash has been paid.',
    'The diagnostic machine is a resource controlled by Atlas Repairs, so it is an asset. Receiving it before paying does not stop it being an asset. We ignore depreciation in this chapter.',
    'A liability is a present obligation of the business. Sam delivered the machine, so Atlas Repairs now owes him €600. The invoice represents that debt; it is not another asset.',
    'Total assets are €1,000 cash plus €600 equipment: €1,600. Total assets are different from your cash balance.',
    'The invoice is payable next month. Receiving the machine has not reduced the bank balance. When you pay Sam later, cash and the supplier liability will both decrease.',
    'Equity is the owner’s residual interest in the business: assets less liabilities. It is not a separate bank account or an additional pile of cash. Here, €1,600 less €600 leaves €1,000, all from your owner contribution.',
    'Assets = Liabilities + Equity. Resources on one side, creditors’ and owner’s claims on the other. The same business is described from two sides; do not add the two sides together.',
    'This is a separate business. Equity is what remains of its assets after its liabilities: €1,400 − €500. Atlas Repairs balances are unchanged by practice.',
    'Assets are resources, liabilities are obligations, and equity is the owner’s residual interest. The equation is an accounting relationship, not a market valuation of the business. Atlas has earned no revenue yet.',
    'You have completed the free chapter. The next chapter will explore customer work, revenue and how profit changes equity. This preview does not record any customer transaction.'
  ];
  function save() { try { localStorage.setItem(key, JSON.stringify(memory)); } catch { storageAvailable = false; } }
  function xp() { return Object.entries({funded:10,recorded:10,earned:15,delivered:10,machine:10,invoice:10,cashCheck:10,equation:20,practice:25,completed:20}).reduce((total,[name,value])=>total+(memory[name]?value:0),0); }
  function bank(extra = '') { return `<div class="bank"><div class="bank-title">ATLAS REPAIRS · BUSINESS ACCOUNT</div><span class="bank-icon" aria-hidden="true">▥</span><div class="bank-amount">€${memory.funded ? '1,000' : '0'}</div><div class="bank-sub">Available balance</div>${extra}</div>`; }
  function workshopHtml(compact = false) {
    const retry=workshopRetry?'?retry='+workshopRetry:'';
    return `<div class="workshop-visual" data-image-state="${workshopStatus}" aria-busy="${workshopStatus==='loading'}"><img class="workshop-art editorial-art" src="workshop-${compact?480:960}.webp${retry}" ${compact?'':`srcset="workshop-640.webp${retry} 640w, workshop-960.webp${retry} 960w" sizes="(max-width: 800px) calc(100vw - 74px), 600px"`} width="960" height="640" decoding="async" fetchpriority="high" alt="A pastel illustrated repair workshop with sage drawers, peach tools and your new workshop keys."><div class="art-loader" role="status"><span class="art-spinner" aria-hidden="true"></span><span>Opening your workshop…</span></div><div class="art-error" role="status"><p>The illustration couldn’t load.</p><button class="secondary" data-action="retry-art">Try again</button></div></div>`;
  }
  function bindWorkshopImage() {
    const img=document.querySelector('.workshop-art'),frame=document.querySelector('.workshop-visual');
    if(!img||!frame?.setAttribute)return;
    const show=()=>{if(!img.isConnected||!img.naturalWidth)return;workshopStatus='ready';frame.setAttribute('data-image-state','ready');frame.setAttribute('aria-busy','false');};
    const loaded=()=>{if(img.decode)img.decode().then(show).catch(show);else show();};
    img.onload=loaded;
    img.onerror=()=>{if(!img.isConnected)return;workshopStatus='error';frame.setAttribute('data-image-state','error');frame.setAttribute('aria-busy','false');};
    if(img.complete){if(img.naturalWidth)loaded();else img.onerror();}
    else{workshopStatus='loading';frame.setAttribute('data-image-state','loading');frame.setAttribute('aria-busy','true');}
  }
  function button(label = 'Continue', action = 'next', disabled = false) { return `<button class="primary" data-action="${action}" ${disabled ? 'disabled' : ''}>${label}<span aria-hidden="true">→</span></button>`; }
  function view() {
    if(memory.step===15 && signup) {
      if(feedbackStep<feedbackQuestions.length) {
        const q=feedbackQuestions[feedbackStep];
        return {eyebrow:'HELP IMPROVE FINTALE · '+(feedbackStep+1)+' OF '+feedbackQuestions.length,title:q.title,text:q.help,
          content:feedbackSliderControls(),visual:feedbackQuestionHtml(q),label:'HELP SHAPE FINTALE',
          guide:'Help us make Fintale better, or sign up to hear when the full version launches. Both are optional.'};
      }
      if(feedbackStep===feedbackQuestions.length+1) return {eyebrow:'DEMO COMPLETE',title:'Thanks for<br><em>playing Fintale.</em>',text:'You’ve taken your first step into business finance. Your takeaway is yours to revisit whenever you like.',cta:button('Revisit my takeaway','return-takeaway'),visual:takeaway(),label:'YOUR FIRST BUSINESS SNAPSHOT',guide:'You don’t need to share feedback or an email to finish the demo.'};
      return {eyebrow:'LAUNCH UPDATES · OPTIONAL',title:'Your next chapter.<br><em>On the list.</em>',text:'Sign up for free access to the full Fintale app when it launches, with more stories and finance courses. We’ll email you when it’s ready.',content:(feedbackSent?'<div class="feedback" role="status">✓ Your feedback has been saved. Thank you! Email signup below is completely optional.</div>':'')+signupHtml(),visual:workshopHtml(true)+'<div class="floating-note">Your next chapter awaits.<strong>Keep learning with Fintale.</strong></div>',label:'THE BEGINNING OF YOUR FINANCE JOURNEY',guide:'Thanks for playing. Signing up is optional—you’ve already unlocked the full takeaway from this demo.'};
    }
    switch (memory.step) {
      case 0: return { eyebrow: 'CHAPTER 01 · YOUR FIRST DAY', title: 'Small workshop.<br><em>Big first step.</em>', text: 'The keys are yours. You know how to fix things. Now, let’s learn how to run the business.', content: '<div class="tag">◷ &nbsp; 5–7 minutes &nbsp; · &nbsp; No experience needed</div>', cta: button('Open my workshop'), foot: 'Learn by doing. No spreadsheets required.', visual: workshopHtml() + '<div class="floating-note">A new beginning.<strong>You’re the owner.</strong></div>', label: 'ATLAS REPAIRS · OPENING DAY', guide: 'I’m Leo. I’ll help with the numbers. You run the workshop.' };
      case 1: return { eyebrow: '01 / MAKE IT YOURS', title: 'A little<br><em>starting fuel.</em>', text: 'Give Atlas Repairs €1,000 from your personal money. Your workshop keeps its own records.', content: feedbackHtml(), cta: memory.funded ? button('See what changed') : '', foot: '', visual: `<div class="transfer-wrap"><div class="wallet"><div class="wallet-title">YOUR PERSONAL WALLET</div>${memory.funded ? '<div class="empty-wallet">€0</div>' : `<button class="money ${selected ? 'selected' : ''}" draggable="true" data-action="select" aria-pressed="${selected}"><small>EUR</small>€1,000<span aria-hidden="true">⠿</span></button>`}</div><div id="bank-target" ${!memory.funded ? 'role="button" tabindex="0" aria-label="Place selected €1,000 in business bank"' : ''} class="${selected ? 'drop-ready' : ''}">${bank(memory.funded ? '<span class="success-dot">Received ✓</span>' : '')}</div><p class="instruction">${memory.funded ? 'One contribution. One new beginning.' : selected ? 'Now tap the business bank to place your money.' : 'Drag the money to the bank, or tap the card then tap the bank.'}</p></div>`, label: 'YOUR FIRST BUSINESS EVENT', guide: 'Your money and the workshop’s money belong in separate records.' };
      case 2: return { eyebrow: '02 / WHAT YOU HAVE', title: 'Your first<br><em>business asset.</em>', text: 'The workshop now has €1,000 in cash. An asset is a resource your business has.', cta: button('Where did it come from?'), visual: `<div class="transfer-wrap">${bank()}<div class="asset-chip">CASH · ASSET</div><p class="instruction">“Cash” includes money in your business bank.</p></div>`, label: 'WHAT THE BUSINESS HAS', guide: 'Same €1,000. We’re giving it a useful name: cash, an asset.' };
      case 3: return { eyebrow: '03 / WHERE IT CAME FROM', title: 'Your money.<br><em>Your contribution.</em>', text: 'You provided the starting money. We record your contribution as owner capital.', content: feedbackHtml(), cta: memory.recorded ? button('Got it. Let’s check.') : button('File my contribution', 'record'), visual: '<div class="receipt"><div class="eyebrow">ATLAS REPAIRS</div><h3>Owner contribution</h3><div class="row"><span>Received from</span><b>You, the owner</b></div><div class="row"><span>Paid into</span><b>Business bank</b></div><div class="total">€1,000.00</div>' + (memory.recorded ? '<div class="stamp">RECORDED ✓</div>' : '<p class="notice">Your opening contribution</p>') + '</div>', label: 'THE SOURCE OF YOUR FUNDING', guide: 'Filing this receipt records the money you already moved. It doesn’t move it again.' };
      case 4: return { eyebrow: '04 / THE IMPORTANT DIFFERENCE', title: 'Money in.<br><em>Money earned?</em>', text: 'Your bank has €1,000. Has Atlas Repairs earned that money by repairing something?', content: `<div class="choices"><button class="choice" data-action="earned-yes">Yes, it earned €1,000</button><button class="choice" data-action="earned-no" aria-pressed="${memory.earned}">No, I put it in</button></div>${feedbackHtml()}`, cta: memory.earned ? button('See my opening position') : '', visual: `<div class="transfer-wrap">${bank()}<div class="stat-card purple" style="margin-top:18px"><small>CUSTOMER WORK COMPLETED</small><b>0 repairs</b></div></div>`, label: 'FOLLOW THE STORY, NOT JUST THE CASH', guide: 'Think about where the money came from. Have you served a customer yet?' };
      case 5: return { eyebrow: '05 / YOUR OPENING POSITION', title: 'One event.<br><em>Two useful views.</em>', text: 'Cash tells you what the business has. Owner capital records the contribution you made.', content: '<div class="tag">Customer revenue so far: €0</div><p class="story-cue">There’s a knock at the workshop door. Sam is here with your equipment.</p>', cta: button('Answer the door'), visual: '<div class="stat-pair"><div class="stat-card"><small>WHAT THE BUSINESS HAS</small><b>€1,000</b><label>Cash · asset</label></div><div class="connect">↕ &nbsp; THE SAME CONTRIBUTION &nbsp; ↕</div><div class="stat-card purple"><small>THE OWNER’S CONTRIBUTION</small><b>€1,000</b><label>Owner capital</label></div></div>', label: 'YOUR BUSINESS RECORDS', guide: 'There is €1,000 in the bank, not €2,000. These cards explain the same event.' };
      case 6: return { eyebrow: 'PART TWO / A KNOCK AT THE DOOR', title: 'A machine today.<br><em>Pay next month.</em>', text: 'Sam arrives with your €600 diagnostic machine. You agreed to pay next month.', content: feedbackHtml(), cta: memory.delivered ? button('Unpack my delivery') : button('Accept the delivery', 'deliver'), visual: '<div class="email-card"><div class="from">↗ &nbsp; SAM · EQUIPMENT SUPPLIER</div><h3>Let’s get you set up.</h3><p>Your diagnostic machine is here. Total: <b>€600.</b></p><p>Payment due next month. Nothing to pay today.</p><div class="signature">Sam</div>'+(memory.delivered?'<div class="stamp">DELIVERED ✓</div>':'')+'</div>', label: 'YOUR SECOND BUSINESS EVENT', guide: 'Equipment arrives now. Payment happens later. Let’s see what changes.' };
      case 7: return { eyebrow: '06 / UNPACK THE MACHINE', title: 'A new tool.<br><em>Where does it belong?</em>', text: 'Your workshop can use this machine to diagnose broken equipment. Put it with what the business has.', content: feedbackHtml(), cta: memory.machine ? button('And the invoice?') : '', visual: classification('machine','Diagnostic machine','€600','What the business has','What the business owes',memory.machine), label: 'SORT YOUR DELIVERY', guide: 'Start with the object itself. It’s a resource your workshop can use.' };
      case 8: return { eyebrow: '07 / THE OTHER HALF', title: 'An unpaid bill.<br><em>A promise to pay.</em>', text: 'Sam’s invoice says you owe €600 next month. Put this obligation where it belongs.', content: feedbackHtml(), cta: memory.invoice ? button('Count what I have') : '', visual: classification('invoice','Sam’s unpaid invoice','€600','What the business has','What the business owes',memory.invoice), label: 'SAME DELIVERY · ONE OBLIGATION', guide: 'The invoice is a record of the amount you owe Sam for the machine.' };
      case 9: return { eyebrow: '08 / YOUR ASSETS', title: 'More than<br><em>money in the bank.</em>', text: 'Your assets include cash and equipment. Together, these business resources total €1,600.', cta: button('What happened to my cash?'), visual: '<div class="stat-pair"><div class="asset-sum"><div><span>Cash</span><b>€1,000</b></div><span class="math-sign">+</span><div><span>Equipment</span><b>€600</b></div></div><div class="stat-card"><small>TOTAL ASSETS · WHAT YOU HAVE</small><b>€1,600</b></div></div>', label: 'TWO RESOURCES · ONE TOTAL', guide: 'Assets include useful equipment as well as cash. You haven’t paid for the machine yet.' };
      case 10: return { eyebrow: '09 / FOLLOW THE CASH', title: 'Did the bank<br><em>balance fall?</em>', text: 'The machine is here. Its €600 invoice is due next month. How much cash is in your bank now?', content: `<div class="choices"><button class="choice" data-action="cash-400">€400</button><button class="choice" data-action="cash-1000" aria-pressed="${memory.cashCheck}">€1,000</button></div>${feedbackHtml()}`, cta: memory.cashCheck ? button('Find the owner’s share') : '', visual: '<div class="receipt"><div class="eyebrow">SAM’S INVOICE</div><h3>Diagnostic machine</h3><div class="total">€600.00</div><div class="row"><span>Payment due</span><b>Next month</b></div><div class="stamp">UNPAID · LIABILITY</div></div>', label: 'RECEIVING IS DIFFERENT FROM PAYING', guide: 'A liability means the business owes something. No payment has left your bank.' };
      case 11: return { eyebrow: '10 / YOUR EQUITY', title: 'What remains<br><em>for the owner?</em>', text: 'Your business has €1,600 in assets and owes €600. The remaining €1,000 is your equity—the owner’s interest in the business.', cta: button('Put it all together'), visual: '<div class="stat-pair"><div class="residual-row"><span>Assets</span><b>€1,600</b></div><div class="residual-row"><span>Less: liabilities</span><b>− €600</b></div><div class="stat-card purple"><small>EQUITY · THE OWNER’S INTEREST</small><b>€1,000</b><label>From your opening contribution</label></div><p class="instruction">Equity is an interest in the business, not another pot of cash.</p></div>', label: 'ASSETS MINUS LIABILITIES', guide: 'You didn’t gain another €1,000. Equity describes what remains after business obligations.' };
      case 12: return { eyebrow: '11 / THE ACCOUNTING EQUATION', title: 'Two sides.<br><em>One business.</em>', text: 'Assets equal liabilities plus equity. Place your workshop’s amounts to connect what it has with how it is funded.', content: feedbackHtml(), cta: memory.equation ? button('Try it without guidance') : '', visual: equationBoard(), label: 'BUILD YOUR BUSINESS SNAPSHOT', guide: 'Your resources total €1,600. Sam has a €600 claim, and your equity is €1,000.' };
      case 13: return { eyebrow: 'PRACTICE / A DIFFERENT BUSINESS', title: 'What belongs<br><em>to the owner?</em>', text: 'A separate workshop has €1,400 in assets and owes €500. Choose the amount of its owner’s equity.', content: `<div class="tag practice-tag">Practice · Atlas balances stay unchanged</div><div class="choices">${[1400,900,1900].map(n=>`<button class="choice" data-action="practice-${n}">€${n.toLocaleString('en-IE')}</button>`).join('')}</div>${feedbackHtml()}`, cta: memory.practice ? button('See what I’ve learned', 'complete') : '', visual: '<div class="receipt"><div class="eyebrow">PRACTICE EXAMPLE</div><h3>A separate workshop</h3><div class="row"><span>Resources · assets</span><b>€1,400</b></div><div class="row"><span>Obligations · liabilities</span><b>€500</b></div><div class="total">Equity: ?</div></div>', label: 'YOUR TURN · A NEW EXAMPLE', guide: 'This example is separate from your story. Choose the amount you think fits.' };
      case 14: return { eyebrow: 'CHAPTER COMPLETE / YOUR TAKEAWAY', title: 'You can see<br><em>the whole picture.</em>', text: 'Everything your business has is funded by creditors or the owner. Assets = liabilities + equity connects those two sides.', content: `<div class="tag">✦ &nbsp; ${xp()} XP earned &nbsp; · &nbsp; Foundation unlocked</div>`, cta: button('Continue'), visual: takeaway() + confetti(), label: 'YOUR ATLAS REPAIRS SNAPSHOT', guide: 'Cash is €1,000. Assets are €1,600. Equity is €1,000. You haven’t earned any revenue yet.' };
      default: return { eyebrow: 'YOUR STORY IS JUST BEGINNING', title: 'Keep learning.<br><em>Get free access.</em>', text: 'You’ve completed the playable demo. The next chapters and more finance courses are in development. Sign up for free access to the full app when it’s ready.', content: signupHtml()+'<button class="secondary feedback-entry" data-action="signup">Give feedback without signing up</button>', foot: 'After signup, you can share optional feedback. Both are optional.', visual: workshopHtml(true)+'<div class="floating-note">Your next chapter awaits.<strong>Keep learning with Fintale.</strong></div>', label: 'MORE STORIES. MORE FINANCE.', guide: 'The full app is still being built. Your signup reserves free access when it launches; feedback helps shape what comes next.' };
    }
  }
  function movable(id, label) { return `<button class="object-card ${activeCard===id?'selected':''}" draggable="true" data-card="${id}" aria-pressed="${activeCard===id}">${label}<span aria-hidden="true">⠿</span></button>`; }
  function classification(id, title, amount, left, right, done) { return `<div class="sort-board">${done ? `<div class="placed-card">✓ ${title} · ${amount}<small>${id==='machine'?'ASSET · A BUSINESS RESOURCE':'LIABILITY · AN OBLIGATION'}</small></div>` : movable(id,`<span>${id==='machine'?'⚙':'▤'} ${title}<small>${amount}</small></span>`)}<div class="sort-zones"><button class="drop-zone" data-place="has" ${done?'disabled':''}><span aria-hidden="true">▣</span>${left}</button><button class="drop-zone peach" data-place="owes" ${done?'disabled':''}><span aria-hidden="true">▤</span>${right}</button></div><p class="instruction">${done?'Sorted. You’re building your business picture.':'Drag the card, or select it then tap a destination.'}</p></div>`; }
  function equationBoard() { const slots=memory.equation?{assets:'1600',liabilities:'600',equity:'1000'}:equationSlots; return `<div class="equation-board"><div class="equation-heading">WHAT YOU HAVE = HOW IT IS FUNDED</div><div class="equation-slots">${['assets','liabilities','equity'].map((name,i)=>`${i?`<span class="equation-symbol">${i===1?'=':'+'}</span>`:''}<button class="equation-slot ${slots[name]?'filled':''} ${name}" data-place="${name}" aria-label="${name}: ${slots[name]?'€'+Number(slots[name]).toLocaleString('en-IE'):'place amount here'}" ${memory.equation?'disabled':''}><span>${name}</span><b>${slots[name]?'€'+Number(slots[name]).toLocaleString('en-IE'):'?'}</b><small>${{assets:'What you have',liabilities:'What you owe',equity:'Owner’s interest'}[name]}</small></button>`).join('')}</div><div class="amount-tray">${memory.equation?'<span class="balanced">✓ Both sides: €1,600</span>':['1000','1600','600'].filter(id=>!Object.values(slots).includes(id)).map(id=>movable(id,'€'+Number(id).toLocaleString('en-IE'))).join('')}</div><p class="instruction">${memory.equation?'Different views. The same business.':'Drag amounts into place, or select an amount then tap a box.'}</p></div>`; }
  function takeaway() { return '<div class="takeaway"><div class="takeaway-icon" aria-hidden="true">✧</div><h3>Your accounting equation</h3><div class="takeaway-item"><span><b>Assets</b><small>Resources: €1,000 cash + €600 equipment</small></span><strong>€1,600</strong></div><div class="takeaway-equals">=</div><div class="takeaway-item"><span><b>Liabilities</b><small>What you owe Sam</small></span><strong>€600</strong></div><div class="takeaway-equals">+</div><div class="takeaway-item purple"><span><b>Equity</b><small>Your interest after liabilities</small></span><strong>€1,000</strong></div><p class="instruction">Cash ≠ total assets. Owner funding ≠ revenue.</p></div>'; }
  function placeCard(destination, id = activeCard) {
    if (!id) { error=true;feedback='Select a card first, then choose where it belongs.';render();return; }
    let correct=false;
    if(memory.step===7 && id==='machine' && !memory.machine) { correct=destination==='has'; if(correct){memory.machine=true;feedback='Exactly. The €600 machine is an asset: a resource your business can use. +10 XP';}else feedback='You have the machine and can use it. Put the machine with what the business has. The debt is shown by Sam’s invoice.'; }
    else if(memory.step===8 && id==='invoice' && !memory.invoice) { correct=destination==='owes'; if(correct){memory.invoice=true;feedback='Right. The €600 you owe Sam is a liability—an obligation to pay. +10 XP';}else feedback='This invoice records your obligation to pay Sam. Place it with what the business owes.'; }
    else if(memory.step===12 && !memory.equation && ['assets','liabilities','equity'].includes(destination) && ['1600','600','1000'].includes(id)) { correct=id===({assets:'1600',liabilities:'600',equity:'1000'})[destination]; if(correct){equationSlots[destination]=id; feedback='That amount fits. Place the remaining cards.';if(Object.keys(equationSlots).length===3){memory.equation=true;feedback='Balanced! €1,600 = €600 + €1,000. You’ve connected your resources with creditor and owner claims. +20 XP';}}else feedback=({assets:'Assets include €1,000 cash plus €600 equipment. Find their combined amount.',liabilities:'The unpaid invoice is your liability. How much do you owe Sam?',equity:'After subtracting €600 owed from €1,600 of assets, what remains for the owner?'})[destination]; }
    else return;
    error=!correct;activeCard='';save();render();
  }
  function feedbackHtml() { return feedback ? `<div class="feedback ${error ? 'error' : ''}" role="status">${feedback}</div>` : ''; }
  function confetti() { return '<div class="burst" aria-hidden="true">' + Array.from({length:18}, (_,i) => `<i style="--x:${(i*37)%100}%;--c:${['#c7b2de','#e3b78a','#87a971'][i%3]};--d:${(i%5)*.12}s"></i>`).join('') + '</div>'; }
  function escapeText(value) { return String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character])); }
  function feedbackQuestionHtml(q) {
    return '<div class="survey-card" id="survey-question-'+q.key+'"><div class="survey-step"><span>QUESTION '+(feedbackStep+1)+' OF '+feedbackQuestions.length+'</span><span>Optional</span></div><div class="survey-dots" aria-hidden="true">'+feedbackQuestions.map((_,i)=>'<i class="'+(i<=feedbackStep?'done':'')+'"></i>').join('')+'</div><label for="feedback-answer">'+q.label+'</label><textarea id="feedback-answer" rows="5" maxlength="500" placeholder="'+q.placeholder+'">'+escapeText(feedbackAnswers[q.key])+'</textarea><p class="notice">Leave this blank if you’d rather skip this question. Your answers are only sent when you choose Send feedback. No email is needed. Please don’t include personal or sensitive details. <a href="privacy.html" target="_blank" rel="noopener">Privacy notice</a>.</p></div>';
  }
  function feedbackSliderControls() {
    const last=feedbackStep===feedbackQuestions.length-1;
    const hasAnswers=Object.values(feedbackAnswers).some(answer=>answer.trim());
    return (feedbackError?'<div class="feedback error" role="alert">'+escapeText(feedbackError)+'</div>':'')+'<div class="survey-navigation">'+button(feedbackSending?'Sending feedback…':last?(hasAnswers?'Send feedback & finish':signupCompleted?'Finish demo':'Continue to email'):'Next question','survey-next',feedbackSending)+(feedbackStep?'<button class="secondary" data-action="survey-back" '+(feedbackSending?'disabled':'')+'>Back</button>':'')+'</div><button class="text-button survey-skip" data-action="survey-skip" '+(feedbackSending?'disabled':'')+'>'+(signupCompleted?'Skip feedback · Finish demo':feedbackError?'Continue without sending · Go to signup':'Skip feedback · Go to signup')+'</button>';
  }
  function moveFeedback(step) { feedbackStep=Math.max(0,Math.min(feedbackQuestions.length+1,step));feedbackError='';keepFeedbackDraft();render();document.querySelector('h1').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'}); }
  async function sendFeedback() {
    if(feedbackSending)return;
    if(!Object.values(feedbackAnswers).some(answer=>answer.trim()) || feedbackSent===feedbackFingerprint()){moveFeedback(signupCompleted?feedbackQuestions.length+1:feedbackQuestions.length);return;}
    const fingerprint=feedbackFingerprint();
    if(feedbackRequestBody!==fingerprint){feedbackRequestId=crypto.randomUUID();feedbackRequestBody=fingerprint;}
    feedbackSending=true;feedbackError='';keepFeedbackDraft();render();
    try {
      await window.FintaleFeedback.submit(window.FintaleFeedbackConfig,feedbackRequestId,{...feedbackAnswers});
      feedbackSent=fingerprint;feedbackSending=false;moveFeedback(signupCompleted?feedbackQuestions.length+1:feedbackQuestions.length);
    } catch (error) { feedbackSending=false;feedbackError=error.message||'Your feedback could not be saved. Please retry.';keepFeedbackDraft();render(); }
  }
  function coachInstruction() {
    if(memory.step===1&&!memory.funded)return selected?{selector:'#bank-target .bank',text:'Now tap the business bank to place €1,000.'}:{selector:'.money',text:'Tap this €1,000 card to pick it up.'};
    if(memory.step===7&&!memory.machine)return activeCard?{selector:'.sort-zones',highlight:'.drop-zone:not(:disabled)',destinations:true,text:'Choose where the machine belongs. Tap either outlined space.'}:{selector:'.object-card',text:'Tap this machine card to pick it up.'};
    if(memory.step===8&&!memory.invoice)return activeCard?{selector:'.sort-zones',highlight:'.drop-zone:not(:disabled)',destinations:true,text:'Choose where the unpaid invoice belongs. Tap either outlined space.'}:{selector:'.object-card',text:'Tap this invoice card to pick it up.'};
    return null;
  }
  function interactionCoachHtml() {
    const hint=coachInstruction();
    return hint?'<div class="coach-slot floating-coach" id="coach-'+memory.step+'-'+(selected||activeCard?'place':'pick')+'" hidden><div class="interaction-coach" role="status"><span aria-hidden="true">☝</span><span>'+hint.text+'</span></div></div>':'';
  }
  function positionCoach() {
    const hint=coachInstruction(), bubble=document.querySelector('.floating-coach');
    if(!hint||!bubble)return;
    const target=document.querySelector(hint.selector);
    if(!target?.getBoundingClientRect)return;
    const rect=target.getBoundingClientRect(),width=window.innerWidth,height=window.innerHeight;
    if(rect.bottom<8||rect.top>height-8||rect.width===0){bubble.hidden=true;return;}
    bubble.style.width=Math.min(290,width-24)+'px';bubble.hidden=false;
    const size=bubble.getBoundingClientRect(),above=rect.top>=size.height+20;
    const left=Math.max(12,Math.min(width-size.width-12,rect.left+rect.width/2-size.width/2));
    const top=Math.max(10,Math.min(height-size.height-10,above?rect.top-size.height-14:rect.bottom+14));
    bubble.style.left=left+'px';bubble.style.top=top+'px';
    bubble.setAttribute('data-side',above?'above':'below');
    bubble.style.setProperty('--coach-arrow',Math.max(20,Math.min(size.width-20,rect.left+rect.width/2-left))+'px');
  }
  function syncCoach() {
    document.querySelectorAll('.hint-target, .possible-target').forEach(node=>node.classList.remove('hint-target','possible-target'));
    const hint=coachInstruction(),target=hint?document.querySelector(hint.selector):null;
    if(!target?.getBoundingClientRect)return;
    const highlighted=hint.highlight?document.querySelectorAll(hint.highlight):[target];
    highlighted.forEach(node=>node.classList.add(hint.destinations?'possible-target':'hint-target'));
    positionCoach();
  }
  function signupHtml() {
    return '<form class="form" id="waitlist" method="POST" action="'+signupEndpoint+'"><label for="email">Your email</label><input type="email" id="email" name="EMAIL" maxlength="254" autocomplete="email" placeholder="you@example.com" value="'+escapeText(restoredEmail)+'" required><label class="consent"><input type="checkbox" id="launch-consent" name="OPT_IN" value="1" required> Email me when the full app is ready, with free access for early signups.</label><input type="text" name="email_address_check" value="" class="signup-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true"><input type="hidden" name="locale" value="en"><input type="hidden" name="html_type" value="simple"><button class="primary" type="submit">Sign up for free access <span aria-hidden="true">→</span></button><p class="notice">Join the early-access list for the free full app when it launches. We’ll send a signup confirmation and launch updates through Brevo. Next, you can answer a few optional feedback questions. You can unsubscribe from those emails at any time. <a href="privacy.html" target="_blank" rel="noopener">Fintale privacy notice</a>.</p></form><button class="text-button survey-skip" data-action="email-skip">Not now · Finish demo</button>';
  }
  // Keep unchanged DOM nodes, images, focus and animations in place.
  function patchNode(current, next) {
    if (current.isEqualNode(next)) return;
    const identity = node => node.nodeType === 1 ? (node.getAttribute('id') || node.getAttribute('data-card') || node.getAttribute('data-place') || node.getAttribute('data-action') || '') : '';
    if (current.nodeType !== next.nodeType || current.nodeName !== next.nodeName || identity(current) !== identity(next)) {
      current.replaceWith(next.cloneNode(true));
      return;
    }
    if (current.nodeType !== 1 && current.nodeType !== 11) {
      current.nodeValue = next.nodeValue;
      return;
    }
    if (current.nodeType === 1) {
      for (const attribute of Array.from(current.attributes)) if (!next.hasAttribute(attribute.name)) current.removeAttribute(attribute.name);
      for (const attribute of Array.from(next.attributes)) if (current.getAttribute(attribute.name) !== attribute.value) current.setAttribute(attribute.name, attribute.value);
    }
    patchChildren(current, next);
  }
  function patchChildren(current, next) {
    const children = Array.from(next.childNodes);
    for (let i = 0; i < children.length; i++) {
      if (current.childNodes[i]) patchNode(current.childNodes[i], children[i]);
      else current.appendChild(children[i].cloneNode(true));
    }
    while (current.childNodes.length > children.length) current.lastChild.remove();
  }
  function patchMarkup(container, markup) {
    const template = document.createElement('template');
    template.innerHTML = markup;
    patchChildren(container, template.content);
  }
  function render() {
    const v = view();
    const markup = `<header class="topbar"><div class="brand"><span class="brand-mark" aria-hidden="true">f</span>fintale<span style="color:#7b936c">.</span></div><div class="top-actions"><span class="top-note">A little learning. A lot of possibility.</span><span class="xp" aria-label="${xp()} experience points">✦ &nbsp; ${xp()} XP</span><button class="icon-button" data-action="restart" aria-label="Restart lesson">↺</button></div></header><main class="shell"><div class="breadcrumb"><span>ACCOUNTING FOUNDATIONS</span><span>${memory.step === 15 ? 'DEMO COMPLETE' : 'CHAPTER 01 · THE ACCOUNTING EQUATION'}</span></div><div class="mobile-step"><span>${memory.step === 15 ? (signup ? (feedbackStep < feedbackQuestions.length ? 'Help improve Fintale' : feedbackStep === feedbackQuestions.length ? 'Launch updates' : 'Demo complete') : 'Free early access') : 'Your first day'}</span><span>${memory.step === 15 ? (signup ? (feedbackStep < feedbackQuestions.length ? `${feedbackStep+1} / ${feedbackQuestions.length}` : 'Optional') : 'Preview') : `${Math.min(memory.step+1,15)} / 15`}</span></div><div class="progress" aria-label="Lesson progress: step ${Math.min(memory.step+1,15)} of 15">${Array.from({length:15},(_,i)=>`<i class="${i <= memory.step ? 'done' : ''}"></i>`).join('')}</div><div class="lesson ${memory.step===15&&(!signup||feedbackStep===feedbackQuestions.length)?'signup-lesson':''}"><section class="lesson-copy"><div class="eyebrow">${v.eyebrow}</div><h1 tabindex="-1">${v.title}</h1><p class="lead">${v.text}</p><div class="lesson-response">${v.content || ''}${v.cta ? `<div class="lesson-actions">${v.cta}</div>` : ''}${v.foot ? `<p class="under-button">${v.foot}</p>` : ''}</div></section><section class="stage" data-placement-active="${Boolean(selected||activeCard)}" aria-label="Interactive lesson scene"><div class="stage-label"><span class="dot"></span>${v.label}</div>${v.visual}</section></div><aside class="guide-bar"><div class="avatar" aria-hidden="true">👨🏻‍🔧</div><p><b>LEO</b>${v.guide}</p><button class="text-button" data-action="guide">${memory.step === 0 ? 'Meet your guide' : 'Why? Ask Leo'}</button></aside><footer class="bottom"><button data-action="back" ${memory.step === 0 ? 'disabled' : ''}>← Back</button><a class="privacy-link" href="privacy.html" target="_blank" rel="noopener">Privacy</a><span>${storageAvailable ? 'Progress saved on this device' : 'Progress kept for this session'}</span></footer></main>${interactionCoachHtml()}`;
    patchMarkup(root, markup);
    bindWorkshopImage();
    bindTransfer();
    document.querySelectorAll('[data-card]').forEach(card=>{card.ondragstart=e=>{e.dataTransfer.setData('text/plain',card.dataset.card);e.dataTransfer.effectAllowed='move';};});
    document.querySelectorAll('[data-place]').forEach(zone=>{
      zone.ondragover=e=>{if(!zone.disabled){e.preventDefault();zone.classList.add('drop-ready');}};
      zone.ondragleave=()=>zone.classList.remove('drop-ready');
      zone.ondrop=e=>{e.preventDefault();if(!zone.disabled)placeCard(zone.dataset.place,e.dataTransfer.getData('text/plain'));};
    });
    const form = document.querySelector('#waitlist');
    if (form) form.onsubmit=e=>{
      if(form.checkValidity && !form.checkValidity()){e.preventDefault();form.reportValidity();return;}
      const submit=document.querySelector('#waitlist button[type="submit"]');
      if(submit?.disabled){e.preventDefault();return;}
      restoredEmail=document.querySelector('#email').value.trim();
      try{sessionStorage.setItem(submissionDraftKey,JSON.stringify({email:restoredEmail,answers:{}}));}catch{}
      if(submit){submit.disabled=true;submit.textContent='Sending…';}
      // Native form submission lets Brevo validate, save and redirect; never fake success.
    };
    const answer=document.querySelector('#feedback-answer');
    if(answer && signup && feedbackStep<feedbackQuestions.length) {
      answer.value=feedbackAnswers[feedbackQuestions[feedbackStep].key];
      answer.disabled=feedbackSending;answer.oninput=()=>{feedbackAnswers[feedbackQuestions[feedbackStep].key]=answer.value.slice(0,500);keepFeedbackDraft();const next=document.querySelector('[data-action="survey-next"]');if(next&&feedbackStep===feedbackQuestions.length-1)next.innerHTML=(Object.values(feedbackAnswers).some(a=>a.trim())?'Send feedback &amp; finish':signupCompleted?'Finish demo':'Continue to email')+'<span aria-hidden="true">→</span>';};
    }
    if(feedback && feedback !== lastFeedback && window.matchMedia?.('(max-width: 800px)')?.matches) document.querySelector('.feedback')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    lastFeedback = feedback;
    if(window.requestAnimationFrame)window.requestAnimationFrame(syncCoach);
  }
  window.addEventListener?.('pageshow',()=>{const submit=document.querySelector('#waitlist button[type="submit"]');if(submit){submit.disabled=false;submit.textContent='Sign up for free access';}});
  function advance() { memory.step = Math.min(15, memory.step+1); feedback=''; error=false; selected=false; activeCard=''; save(); render(); document.querySelector('h1').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
  function fund() { if (memory.funded) return; memory.funded=true; selected=false; feedback='€1,000 received. Your workshop now has its starting money. +10 XP'; error=false; save(); render(); }
  function bindTransfer() {
    const card=document.querySelector('.money'), target=document.querySelector('#bank-target');
    if(!card || !target) return;
    card.ondragstart=e=>{e.dataTransfer.setData('text/plain','owner-contribution-1000');e.dataTransfer.effectAllowed='move';};
    target.ondragover=e=>{e.preventDefault();target.classList.add('drop-ready');};
    target.ondragleave=()=>target.classList.remove('drop-ready');
    target.ondrop=e=>{e.preventDefault();if(e.dataTransfer.getData('text/plain')==='owner-contribution-1000')fund();};
    target.onclick=()=>{if(selected)fund();};
    target.onkeydown=e=>{if(selected&&['Enter',' '].includes(e.key)){e.preventDefault();fund();}};
  }
  root.addEventListener('click', e => {
    const card=e.target.closest('[data-card]');if(card){activeCard=activeCard===card.dataset.card?'':card.dataset.card;render();document.querySelector('[data-place]:not(:disabled)')?.focus({preventScroll:true});return;}
    const destination=e.target.closest('[data-place]');if(destination){if(!destination.disabled)placeCard(destination.dataset.place);return;}
    const action=e.target.closest('[data-action]')?.dataset.action; if (!action) return;
    if(action==='retry-art'){workshopRetry++;workshopStatus='loading';render();return;}
    if(feedbackSending&&['survey-next','survey-back','survey-skip','back','restart'].includes(action))return;
    if(action==='survey-next'){if(feedbackStep===feedbackQuestions.length-1)sendFeedback();else moveFeedback(feedbackStep+1);return;}
    if(action==='survey-back'){moveFeedback(feedbackStep-1);return;}
    if(action==='survey-skip'||action==='survey-email'){moveFeedback(signupCompleted?feedbackQuestions.length+1:feedbackQuestions.length);return;}
    if(action==='email-skip'){signup=true;moveFeedback(feedbackQuestions.length+1);return;}
    if(action==='return-takeaway'){signup=false;memory.step=14;save();render();document.querySelector('h1').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});return;}
    if(action==='back'&&memory.step===15&&signup){if(feedbackStep>0)moveFeedback(feedbackStep-1);else{signup=false;render();}return;}

    if (action==='next') { const required={1:'funded',3:'recorded',4:'earned',6:'delivered',7:'machine',8:'invoice',10:'cashCheck',12:'equation',13:'practice'};if(required[memory.step]&&!memory[required[memory.step]])return; advance(); }
    if (action==='back' && memory.step>0) { memory.step--; feedback=''; error=false; selected=false; activeCard=''; save(); render(); document.querySelector('h1').focus({preventScroll:true}); }
    if (action==='select') { selected=!selected; render(); if(selected) document.querySelector('#bank-target').focus({preventScroll:true}); }
    if (action==='record') { memory.recorded=true; feedback='Contribution recorded. Your bank still has €1,000. +10 XP'; save(); render(); }
    if (action==='earned-yes') { error=true; feedback='The cash increased, but it came from you. Revenue comes from work the business has earned payment for. No repairs yet—try again.'; render(); }
    if (action==='earned-no') { const first=!memory.earned; memory.earned=true; error=false; feedback='Exactly. You funded the workshop; it hasn’t earned customer revenue yet.' + (first?' +15 XP':''); save(); render(); }
    if(action==='deliver' && memory.step===6){const first=!memory.delivered;memory.delivered=true;error=false;feedback='Machine received. You owe Sam €600; your bank still has €1,000.'+(first?' +10 XP':'');save();render();}
    if(action==='cash-400'){error=true;feedback='No money has been paid yet. The €600 is a liability due next month; cash stays in your bank. Try again.';render();}
    if(action==='cash-1000'){const first=!memory.cashCheck;memory.cashCheck=true;error=false;feedback='Exactly. Cash stays at €1,000. You gained equipment and a €600 liability.'+(first?' +10 XP':'');save();render();}
    if(action==='practice-1400'||action==='practice-1900'){error=true;feedback=action==='practice-1400'?'€1,400 is all the assets. The owner’s equity is what remains after the €500 obligation. Try again.':'Adding the obligation to assets overstates the owner’s interest. Subtract what the business owes from what it has. Try again.';render();}
    if(action==='practice-900'){const first=!memory.practice;memory.practice=true;error=false;feedback='Exactly. €1,400 − €500 = €900 equity. Check: €1,400 = €500 + €900. Your Atlas balances are unchanged.'+(first?' +25 XP':'');save();render();}
    if (action==='complete' && memory.step===13 && memory.practice && memory.equation) { const firstCompletion=!memory.completed; memory.completed=true; advance(); if(firstCompletion){document.querySelector('#unlock-xp').textContent=`${xp()} XP · Milestone reached`;document.querySelector('#chapter-unlock').showModal();} }
    if (action==='guide') { document.querySelector('#guide-copy').textContent=tips[memory.step]; document.querySelector('#guide').showModal(); }
    if (action==='restart') document.querySelector('#restart').showModal();
    if (action==='signup'||action==='launch-updates') { signup=true; feedbackStep=action==='launch-updates'?feedbackQuestions.length:0; keepFeedbackDraft();render(); document.querySelector('h1').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
  });
  document.querySelectorAll('#guide .close, #guide .close-guide').forEach(b=>b.addEventListener('click',()=>document.querySelector('#guide').close()));
  document.querySelector('#restart .cancel').addEventListener('click',()=>document.querySelector('#restart').close());
  document.querySelector('#restart .reset').addEventListener('click',()=>{memory=fresh();feedbackStep=0;for(const name of Object.keys(feedbackAnswers))feedbackAnswers[name]='';selected=false;activeCard='';equationSlots={};feedback='';error=false;signup=false;restoredEmail='';try{sessionStorage.removeItem(submissionDraftKey);sessionStorage.removeItem(feedbackDraftKey);feedbackSent='';feedbackRequestId='';feedbackRequestBody='';feedbackError='';}catch{}save();document.querySelector('#restart').close();render();});
  document.querySelectorAll('[data-unlock-close]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#chapter-unlock').close();document.querySelector('h1').focus({preventScroll:true});}));
  window.addEventListener?.('scroll',positionCoach,{passive:true,capture:true});
  window.addEventListener?.('resize',positionCoach,{passive:true});
  render();
})();