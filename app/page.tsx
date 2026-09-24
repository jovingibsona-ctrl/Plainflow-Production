"use client";

import { useState } from "react";

type Step = {
  id: string;
  app: string;
  action: string;
  requiresApproval: boolean;
};

type Workflow = {
  name: string;
  trigger: { app: string; event: string };
  steps: Step[];
};

const risky = /send|email|mail|reply|post|pay|charge|refund|delete|remove|text|sms|invoice/i;

function appFor(text: string) {
  if (/email|mail|reply|inbox/i.test(text)) return "Gmail";
  if (/slack|notify|message/i.test(text)) return "Slack";
  if (/log|sheet|spreadsheet|record|row/i.test(text)) return "Google Sheets";
  if (/invoice|payment/i.test(text)) return "QuickBooks";
  if (/calendar|meeting|schedule|book/i.test(text)) return "Google Calendar";
  return "Your app";
}

function buildWorkflow(input: string): Workflow {
  const m = input.replace(/[.!]$/, "").match(/^(?:when|whenever|if|every time)\s+(.+?)[,;]\s*(.+)$/i);
  const trigger = m ? m[1] : "Something happens";
  const rest = m ? m[2] : input;
  const parts = rest.split(/,\s*(?:and\s+)?|\s+and\s+|\s+then\s+/i)
    .map(x => x.trim()).filter(Boolean).slice(0, 6);

  return {
    name: trigger.charAt(0).toUpperCase() + trigger.slice(1),
    trigger: { app: appFor(trigger), event: trigger },
    steps: parts.map((action, i) => ({
      id: `${Date.now()}-${i}`,
      app: appFor(action),
      action: action.charAt(0).toUpperCase() + action.slice(1),
      requiresApproval: risky.test(action)
    }))
  };
}

export default function Home() {
  const [input, setInput] = useState("");
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const build = () => {
    if (!input.trim()) return setNotice("Describe what you want Plainflow to do.");
    setBusy(true);
    setNotice("");
    setTimeout(() => {
      setWorkflow(buildWorkflow(input.trim()));
      setLogs([]);
      setBusy(false);
      setNotice("Workflow created. Review every action before connecting a real account.");
    }, 300);
  };

  const test = () => {
    if (!workflow) return;
    setBusy(true);
    setLogs(["SAFE TEST: sample data only. No external account was contacted."]);
    workflow.steps.forEach((s, i) => {
      setTimeout(() => {
        setLogs(old => [...old, `${s.requiresApproval ? "APPROVAL REQUIRED" : "SIMULATED"}: ${s.action} (${s.app})`]);
        if (i === workflow.steps.length - 1) setBusy(false);
      }, 450 * (i + 1));
    });
  };

  const remove = (id: string) => {
    setWorkflow(w => w && w.steps.length > 1 ? {...w, steps: w.steps.filter(s => s.id !== id)} : w);
  };

  return (
    <main>
      <nav><b>Plainflow</b><span>Secure automation platform</span><button>Sign in</button></nav>

      <header>
        <div className="eyebrow">PLAINFLOW 1.0</div>
        <h1>Automate work.<br/><em>Keep control.</em></h1>
        <p>Describe the result you want. Plainflow builds a workflow you can review, test, approve and run.</p>
      </header>

      <section className="card builder">
        <label htmlFor="prompt">What should happen?</label>
        <textarea id="prompt" value={input} onChange={e => setInput(e.target.value)}
          placeholder="When a customer emails a complaint, log it in a sheet, notify me on Slack, and draft a reply" />
        <button className="primary" onClick={build} disabled={busy}>{busy ? "Building…" : "Build automation"}</button>
        {notice && <div className="notice">{notice}</div>}
      </section>

      {workflow && <section className="card">
        <div className="sectionTop">
          <div><div className="eyebrow">WORKFLOW</div><h2>{workflow.name}</h2></div>
          <span className="badge">Security review</span>
        </div>
        <div className="flow">
          <div className="node trigger"><span>T</span><div><small>WHEN · {workflow.trigger.app}</small><b>{workflow.trigger.event}</b></div></div>
          {workflow.steps.map(s => <div key={s.id}>
            <div className="line"/>
            <div className="node"><span>{s.app[0]}</span><div className="nodeText"><small>THEN · {s.app}</small><b>{s.action}</b>{s.requiresApproval && <i>Approval required</i>}</div><button onClick={() => remove(s.id)}>Remove</button></div>
          </div>)}
        </div>
        <div className="row"><button className="primary" onClick={test} disabled={busy}>Safe test</button><button disabled>Save to account</button></div>
        {logs.length > 0 && <div className="logs">{logs.map((x,i)=><div key={i}>{x}</div>)}</div>}
      </section>}

      <section className="security">
        <div><strong>Security by design</strong><p>Real actions will be enforced server-side with OAuth scopes, approval policies, encrypted credentials and audit logs.</p></div>
        <div><strong>Your ownership</strong><p>Production credentials, repository, database, domain and deployment account stay under your control.</p></div>
      </section>

      <footer>Plainflow · Production foundation · Safe test mode</footer>
    </main>
  );
}
