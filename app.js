(() => {
  'use strict';
  const key = 'modelquest.chapter1.v2';
  const fresh = () => ({ step: 0, funded: false, recorded: false, earned: false, delivered: false, machine: false, invoice: false, cashCheck: false, equation: false, practice: false, completed: false });
  let memory = fresh();
  let storageAvailable = true;
  try { const saved = JSON.parse(localStorage.getItem(key)); if (saved && Number.isInteger(saved.step) && saved.step >= 0 && saved.step <= 15) for (const k of Object.keys(memory)) { if (typeof saved[k] === typeof memory[k]) memory[k] = saved[k]; } } catch { storageAvailable = false; }
  let selected = false, feedback = '', error = false, signup = false, previewSubmitted = false;
  let activeCard = '', equationSlots = {}, lastFeedback = ''; 
  const root = document.querySelector('#app');
  let feedbackStep = 0;
  const feedbackAnswers = { liked: '', improve: '', next: '' };
  const feedbackQuestions = [
    {key:'liked', title:'What did you<br><em>like?</em>', label:'What did you like?', help:'Was there a moment, interaction or explanation you enjoyed?', placeholder:'Tell us what worked for you…'},
    {key:'improve', title:'What could<br><em>be better?</em>', label:'What didn’t work for you?', help:'Anything confusing, frustrating or missing? We’d love to know.', placeholder:'Tell us what didn’t work…'},
    {key:'next', title:'What would you<br><em>like next?</em>', label:'What would you like to see next?', help:'A finance topic, feature or different way to learn—what would bring you back?', placeholder:'Tell us what you’d like to explore…'}
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
  const workshop = `<img class="workshop-art editorial-art" src="workshop-pastel-v5.png" width="1536" height="1024" decoding="async" alt="A pastel illustrated repair workshop with sage drawers, peach tools and your new workshop keys.">`;
  function button(label = 'Continue', action = 'next', disabled = false) { return `<button class="primary" data-action="${action}" ${disabled ? 'disabled' : ''}>${label}<span aria-hidden="true">→</span></button>`; }
  function view() {
    if(memory.step===15 && signup) {
      if(feedbackStep<3) {
        const q=feedbackQuestions[feedbackStep];
        return {eyebrow:'HELP IMPROVE FINTALE · '+(feedbackStep+1)+' OF 3',title:q.title,text:feedbackStep===0?'Please help improve Fintale by sharing what you liked. Or skip to sign up for news when the full version launches. Both are optional.':q.help,
          content:feedbackSliderControls(),visual:feedbackQuestionHtml(q),label:'HELP SHAPE FINTALE',
          guide:'Help us make Fintale better, or sign up to hear when the full version launches. Both are optional.'};
      }
      if(feedbackStep===3) {
        const url=createFeedbackUrl(feedbackAnswers.liked,feedbackAnswers.improve,feedbackAnswers.next);
        return {eyebrow:'YOUR FEEDBACK · OPTIONAL',title:'Thanks for<br><em>helping us grow.</em>',text:url?'You can review your feedback on GitHub before sending it, or continue without sending.':'No feedback this time? That’s fine. You can continue to the optional email step.',
          content:(url && url.length<=7000?'<a class="primary feedback-review-link" href="'+url+'" target="_blank" rel="noopener noreferrer">Review feedback on GitHub <span aria-hidden="true">↗</span></a><p class="notice">A GitHub account is required. Feedback is public. Review the draft and submit it there to send it; opening it alone does not send anything.</p>':url?'<p class="notice">Your draft is too long for a GitHub link. Use Back to shorten it before sending.</p>':'')+'<div class="survey-navigation"><button class="secondary" data-action="survey-back">Back</button>'+button('Sign up for launch news','survey-email')+'</div>',
          visual:feedbackReviewHtml(),label:'YOUR THOUGHTS, TOGETHER',guide:'Your feedback isn’t sent automatically. Email signup is a separate, optional next step.'};
      }
      if(feedbackStep===5) return {eyebrow:'DEMO COMPLETE',title:'Thanks for<br><em>playing Fintale.</em>',text:'You’ve taken your first step into business finance. Your takeaway is yours to revisit whenever you like.',cta:button('Revisit my takeaway','return-takeaway'),visual:takeaway(),label:'YOUR FIRST BUSINESS SNAPSHOT',guide:'You don’t need to share feedback or an email to finish the demo.'};
      return {eyebrow:'LAUNCH UPDATES · OPTIONAL',title:'Be first to hear<br><em>what comes next.</em>',text:'Enjoyed the demo? Leave your email to hear when the full version of Fintale launches, with more stories and finance courses. Signing up is optional.',content:signupHtml(),visual:workshop+'<div class="floating-note">Your next chapter awaits.<strong>Keep learning with Fintale.</strong></div>',label:'THE BEGINNING OF YOUR FINANCE JOURNEY',guide:'Thanks for playing. Signing up is optional—you’ve already unlocked the full takeaway from this demo.'};
    }
    switch (memory.step) {
      case 0: return { eyebrow: 'CHAPTER 01 · YOUR FIRST DAY', title: 'Small workshop.<br><em>Big first step.</em>', text: 'The keys are yours. You know how to fix things. Now, let’s learn how to run the business.', content: '<div class="tag">◷ &nbsp; 5–7 minutes &nbsp; · &nbsp; No experience needed</div>', cta: button('Open my workshop'), foot: 'Learn by doing. No spreadsheets required.', visual: workshop + '<div class="floating-note">A new beginning.<strong>You’re the owner.</strong></div>', label: 'ATLAS REPAIRS · OPENING DAY', guide: 'I’m Leo. I’ll help with the numbers. You run the workshop.' };
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
      case 14: return { eyebrow: 'CHAPTER COMPLETE / YOUR TAKEAWAY', title: 'You can see<br><em>the whole picture.</em>', text: 'Everything your business has is funded by creditors or the owner. Assets = liabilities + equity connects those two sides.', content: `<div class="tag">✦ &nbsp; ${xp()} XP earned &nbsp; · &nbsp; Foundation unlocked</div>`, cta: button('Meet my first customer'), visual: takeaway() + confetti(), label: 'YOUR ATLAS REPAIRS SNAPSHOT', guide: 'Cash is €1,000. Assets are €1,600. Equity is €1,000. You haven’t earned any revenue yet.' };
      default: return { eyebrow: 'UP NEXT / YOUR FIRST CUSTOMER', title: 'Ready to earn<br><em>your first repair fee?</em>', text: 'Tomorrow, your first customer brings in a broken drill. What will earning a repair fee change in your business?', content: signupHtml(), cta: signup ? '' : button('Continue', 'signup'), foot: 'Chapter two preview', visual: '<div class="email-card"><div class="from">↗ &nbsp; ALEX · YOUR FIRST CUSTOMER</div><h3>Can you fix my drill?</h3><p>Sam said you’re open! My drill stopped working. Can I bring it in tomorrow?</p><p>I can pay as soon as it’s repaired.</p><div class="signature">Alex</div></div>', label: 'YOUR STORY IS JUST GETTING STARTED', guide: 'Next: revenue, profit and what earning money changes. Your answers from this chapter stay unlocked.' };
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
    return '<div class="survey-card" id="survey-question-'+q.key+'"><div class="survey-step"><span>QUESTION '+(feedbackStep+1)+' OF 3</span><span>Optional</span></div><div class="survey-dots" aria-hidden="true">'+feedbackQuestions.map((_,i)=>'<i class="'+(i<=feedbackStep?'done':'')+'"></i>').join('')+'</div><label for="feedback-answer">'+q.label+'</label><textarea id="feedback-answer" rows="5" maxlength="600" placeholder="'+q.placeholder+'">'+escapeText(feedbackAnswers[q.key])+'</textarea><p class="notice">Leave this blank if you’d rather skip this question. Your answers stay on this page until you choose to send them.</p></div>';
  }
  function feedbackSliderControls() { return '<div class="survey-navigation">'+(feedbackStep?'<button class="secondary" data-action="survey-back">Back</button>':'')+button(feedbackStep===2?'Review feedback':'Next question','survey-next')+'</div><button class="text-button survey-skip" data-action="survey-skip">Skip feedback · Sign up for launch news</button>'; }
  function feedbackReviewHtml() {
    return '<div class="survey-review"><div class="eyebrow">YOUR FEEDBACK DRAFT</div>'+feedbackQuestions.map(q=>'<div class="survey-review-item"><b>'+q.label+'</b><p>'+escapeText(feedbackAnswers[q.key].trim()||'Skipped')+'</p></div>').join('')+'</div>';
  }
  function moveFeedback(step) { feedbackStep=Math.max(0,Math.min(5,step));render();document.querySelector('h1').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'}); }
  function coachInstruction() {
    if(memory.step===1&&!memory.funded)return selected?{selector:'#bank-target .bank',text:'Now tap the business bank to place €1,000.'}:{selector:'.money',text:'Tap this €1,000 card to pick it up.'};
    if(memory.step===3&&!memory.recorded)return {selector:'[data-action="record"]',text:'Tap here to record your contribution.'};
    if(memory.step===4&&!memory.earned)return {selector:'.choices',highlight:'.choices .choice',text:'Your turn: tap the answer you think is right.'};
    if(memory.step===6&&!memory.delivered)return {selector:'[data-action="deliver"]',text:'Tap here to accept Sam’s delivery.'};
    if(memory.step===7&&!memory.machine)return activeCard?{selector:'[data-place="has"]',text:'Now tap here to place the machine.'}:{selector:'.object-card',text:'Tap this machine card to pick it up.'};
    if(memory.step===8&&!memory.invoice)return activeCard?{selector:'[data-place="owes"]',text:'Now tap here to place the invoice.'}:{selector:'.object-card',text:'Tap this invoice card to pick it up.'};
    if(memory.step===10&&!memory.cashCheck)return {selector:'.choices',highlight:'.choices .choice',text:'Tap the amount you think is in your bank.'};
    if(memory.step===12&&!memory.equation){
      if(!activeCard)return {selector:'.amount-tray',highlight:'.amount-tray .object-card',text:'Tap an amount card to pick it up.'};
      const account=({1600:'assets',600:'liabilities',1000:'equity'})[activeCard];
      return {selector:'[data-place="'+account+'"]',text:'Now tap '+account+' to place €'+Number(activeCard).toLocaleString('en-IE')+'.'};
    }
    if(memory.step===13&&!memory.practice)return {selector:'.choices',highlight:'.choices .choice',text:'Choose an answer. Tap the amount you think fits.'};
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
    const hint=coachInstruction(),target=hint?document.querySelector(hint.selector):null;
    if(!target?.getBoundingClientRect)return;
    document.querySelectorAll('.hint-target').forEach(node=>node.classList.remove('hint-target'));
    const highlighted=hint.highlight?document.querySelectorAll(hint.highlight):[target];
    highlighted.forEach(node=>node.classList.add('hint-target'));
    positionCoach();
  }
  function createFeedbackUrl(liked, improve, next) {
    const answers=[liked,improve,next].map(value=>value.trim());
    if(!answers.some(Boolean)) return null;
    const headings=['What I liked','What could be improved','What I would like next'];
    const body='Fintale demo feedback\n\n'+answers.map((answer,i)=>'### '+headings[i]+'\n'+(answer||'Not answered')).join('\n\n');
    return 'https://github.com/simovicm26/fintale/issues/new?title='+encodeURIComponent('Demo feedback')+'&body='+encodeURIComponent(body);
  }
  function signupHtml() {
    if(!signup)return '';
    const waitlist=previewSubmitted?'<div class="feedback" role="status">That’s the signup preview. No email was stored or sent. We’ll connect a real waitlist before launch.</div>':'<form class="form" id="waitlist"><label for="email">Your email</label><input type="email" id="email" autocomplete="email" placeholder="you@example.com" required><label class="consent"><input type="checkbox" required> I’d like an email when the full Fintale product launches.</label><button class="primary" type="submit">Preview signup <span aria-hidden="true">→</span></button><p class="notice">Demo only. This form does not store or send your email. A live signup and privacy notice will be added before launch.</p></form>';
    return waitlist+'<button class="text-button survey-skip" data-action="email-skip">Not now · Finish demo</button>';
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
    const markup = `<header class="topbar"><div class="brand"><span class="brand-mark" aria-hidden="true">f</span>fintale<span style="color:#7b936c">.</span></div><div class="top-actions"><span class="top-note">A little learning. A lot of possibility.</span><span class="xp" aria-label="${xp()} experience points">✦ &nbsp; ${xp()} XP</span><button class="icon-button" data-action="restart" aria-label="Restart lesson">↺</button></div></header><main class="shell"><div class="breadcrumb"><span>ACCOUNTING FOUNDATIONS</span><span>${memory.step === 15 ? (signup ? 'DEMO COMPLETE' : 'CHAPTER 02 · YOUR FIRST CUSTOMER') : 'CHAPTER 01 · THE ACCOUNTING EQUATION'}</span></div><div class="mobile-step"><span>${memory.step === 15 ? (signup ? (feedbackStep < 4 ? 'Help improve Fintale' : feedbackStep === 4 ? 'Launch updates' : 'Demo complete') : 'Your next chapter') : 'Your first day'}</span><span>${memory.step === 15 ? (signup ? (feedbackStep < 3 ? `${feedbackStep+1} / 3` : 'Optional') : 'Preview') : `${Math.min(memory.step+1,15)} / 15`}</span></div><div class="progress" aria-label="Lesson progress: step ${Math.min(memory.step+1,15)} of 15">${Array.from({length:15},(_,i)=>`<i class="${i <= memory.step ? 'done' : ''}"></i>`).join('')}</div><div class="lesson"><section class="lesson-copy"><div class="eyebrow">${v.eyebrow}</div><h1 tabindex="-1">${v.title}</h1><p class="lead">${v.text}</p><div class="lesson-response">${v.content || ''}${v.cta ? `<div class="lesson-actions">${v.cta}</div>` : ''}${v.foot ? `<p class="under-button">${v.foot}</p>` : ''}</div></section><section class="stage" data-placement-active="${Boolean(selected||activeCard)}" aria-label="Interactive lesson scene"><div class="stage-label"><span class="dot"></span>${v.label}</div>${v.visual}</section></div><aside class="guide-bar"><div class="avatar" aria-hidden="true">👨🏻‍🔧</div><p><b>LEO</b>${v.guide}</p><button class="text-button" data-action="guide">${memory.step === 0 ? 'Meet your guide' : 'Why? Ask Leo'}</button></aside><footer class="bottom"><button data-action="back" ${memory.step === 0 ? 'disabled' : ''}>← Back</button><span>${storageAvailable ? 'Progress saved on this device' : 'Progress kept for this session'}</span></footer></main>${interactionCoachHtml()}`;
    patchMarkup(root, markup);
    bindTransfer();
    document.querySelectorAll('[data-card]').forEach(card=>{card.ondragstart=e=>{e.dataTransfer.setData('text/plain',card.dataset.card);e.dataTransfer.effectAllowed='move';};});
    document.querySelectorAll('[data-place]').forEach(zone=>{
      zone.ondragover=e=>{if(!zone.disabled){e.preventDefault();zone.classList.add('drop-ready');}};
      zone.ondragleave=()=>zone.classList.remove('drop-ready');
      zone.ondrop=e=>{e.preventDefault();if(!zone.disabled)placeCard(zone.dataset.place,e.dataTransfer.getData('text/plain'));};
    });
    const form = document.querySelector('#waitlist');
    if (form) form.onsubmit=e=>{e.preventDefault();previewSubmitted=true;render();};
    const answer=document.querySelector('#feedback-answer');
    if(answer && signup && feedbackStep<3) {
      answer.value=feedbackAnswers[feedbackQuestions[feedbackStep].key];
      answer.oninput=()=>{feedbackAnswers[feedbackQuestions[feedbackStep].key]=answer.value;};
    }
    if(feedback && feedback !== lastFeedback && window.matchMedia?.('(max-width: 800px)')?.matches) document.querySelector('.feedback')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    lastFeedback = feedback;
    if(window.requestAnimationFrame)window.requestAnimationFrame(syncCoach);
  }
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
    if(action==='survey-next'){moveFeedback(feedbackStep+1);return;}
    if(action==='survey-back'){moveFeedback(feedbackStep-1);return;}
    if(action==='survey-skip'||action==='survey-email'){moveFeedback(4);return;}
    if(action==='email-skip'){moveFeedback(5);return;}
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
    if (action==='signup') { signup=true; feedbackStep=0; render(); document.querySelector('h1').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
  });
  document.querySelectorAll('#guide .close, #guide .close-guide').forEach(b=>b.addEventListener('click',()=>document.querySelector('#guide').close()));
  document.querySelector('#restart .cancel').addEventListener('click',()=>document.querySelector('#restart').close());
  document.querySelector('#restart .reset').addEventListener('click',()=>{memory=fresh();feedbackStep=0;for(const name of Object.keys(feedbackAnswers))feedbackAnswers[name]='';selected=false;activeCard='';equationSlots={};feedback='';error=false;signup=false;previewSubmitted=false;save();document.querySelector('#restart').close();render();});
  document.querySelectorAll('[data-unlock-close]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#chapter-unlock').close();document.querySelector('h1').focus({preventScroll:true});}));
  window.addEventListener?.('scroll',positionCoach,{passive:true,capture:true});
  window.addEventListener?.('resize',positionCoach,{passive:true});
  render();
})();
