(function () {
  'use strict';
  window.FintaleFeedback = {
    async submit(config, id, answers) {
      if (!config || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url) || !/^sb_publishable_/.test(config.key)) throw new Error('Feedback is temporarily unavailable. Your answers are still here; please try again later.');
      const body = {id, liked:answers.liked.trim().slice(0,500), improve:answers.improve.trim().slice(0,500), finance:answers.next.trim().slice(0,500), accounting:answers.accounting.trim().slice(0,500)};
      if (([body.liked,body.improve,body.finance,body.accounting].join(' ').match(/\p{L}/gu) || []).length < 5) throw new Error('Please add a few words of feedback, or continue without sending.');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(config.url + '/rest/v1/rpc/submit_demo_feedback', {method:'POST', headers:{apikey:config.key,'Content-Type':'application/json'}, body:JSON.stringify({p_id:body.id,p_liked:body.liked,p_improve:body.improve,p_finance:body.finance,p_accounting:body.accounting}), signal:controller.signal});
        if (!response.ok) {
          const failure = await response.json().catch(() => ({}));
          if (failure.message === 'feedback_rate_limited') throw new Error('Feedback is busy right now. Your answers are still here; please try again later or continue without sending.');
          if (failure.message === 'invalid_feedback') throw new Error('Please add a few words of feedback, or continue without sending.');
          throw new Error('Feedback could not be saved. Your answers are still here. Please retry or continue without sending.');
        }
      } catch (error) {
        if (error.name === 'AbortError' || error instanceof TypeError) throw new Error('We couldn’t confirm your feedback was saved. Your answers are still here. Please retry when you’re connected.');
        throw error;
      } finally { clearTimeout(timer); }
    }
  };
})();
