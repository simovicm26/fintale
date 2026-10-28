(function () {
  'use strict';
  window.FintaleFeedback = {
    async submit(config, id, answers) {
      if (!config || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url) || !/^sb_publishable_/.test(config.key)) throw new Error('Feedback is temporarily unavailable. Your answers are still here; please try again later.');
      const body = {id, liked:answers.liked.trim().slice(0,500), improve:answers.improve.trim().slice(0,500), finance:answers.next.trim().slice(0,500), accounting:answers.accounting.trim().slice(0,500)};
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(config.url + '/rest/v1/demo_feedback', {method:'POST', headers:{apikey:config.key,'Content-Type':'application/json',Prefer:'return=minimal'}, body:JSON.stringify(body), signal:controller.signal});
        // Only this browser-generated request UUID can conflict. Retrying an accepted
        // request must not create another row or require public read access.
        if (!response.ok && response.status !== 409) throw new Error('Feedback could not be saved. Your answers are still here. Please retry or continue without sending.');
      } catch (error) {
        if (error.name === 'AbortError' || error instanceof TypeError) throw new Error('We couldn’t confirm your feedback was saved. Your answers are still here. Please retry when you’re connected.');
        throw error;
      } finally { clearTimeout(timer); }
    }
  };
})();