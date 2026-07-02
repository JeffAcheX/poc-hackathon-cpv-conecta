import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { responderPergunta, sugestoesMedicamento, iaAtiva } from '@/lib/ai';
import { AMOSTRAS, CONTEUDOS } from '@/data/mockData';
import type { ChatMessage } from '@/types';
import { IconArticle, IconBack, IconSample, IconSend, IconSpark } from '@/components/icons';

const ESTAGIOS_PENSANDO = [
  'Analisando sua pergunta…',
  'Consultando base científica…',
  'Finalizando resposta…',
];

export function AssistantScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { medico, registrarPergunta } = useApp();
  const { showToast } = useToast();
  const sugestoes = useMemo(() => sugestoesMedicamento(medico), [medico]);

  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [estagio, setEstagio] = useState(0);
  const fimRef = useRef<HTMLDivElement>(null);
  const iniciou = useRef(false);

  // alterna a mensagem de "pensando" enquanto aguarda a resposta
  useEffect(() => {
    if (!carregando) {
      setEstagio(0);
      return;
    }
    const id = setInterval(() => {
      setEstagio((e) => (e + 1) % ESTAGIOS_PENSANDO.length);
    }, 900);
    return () => clearInterval(id);
  }, [carregando]);

  // pergunta pré-preenchida vinda da Home (uma única vez, mesmo no StrictMode)
  useEffect(() => {
    if (iniciou.current) return;
    iniciou.current = true;
    const inicial = (location.state as { pergunta?: string } | null)?.pergunta;
    if (inicial) enviar(inicial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, carregando]);

  async function enviar(texto: string) {
    const pergunta = texto.trim();
    if (!pergunta || carregando || !medico) return;

    const novaLista: ChatMessage[] = [
      ...mensagens,
      { autor: 'medico', texto: pergunta },
    ];
    setMensagens(novaLista);
    setInput('');
    setCarregando(true);

    // pontua a primeira consulta do dia
    if (registrarPergunta()) {
      showToast('Consulta ao Representante Digital registrada! +10 pts.');
    }

    const r = await responderPergunta(medico, pergunta, novaLista);
    setMensagens((prev) => [
      ...prev,
      {
        autor: 'assistente',
        texto: r.resposta,
        conteudosRelacionados: r.conteudosRelacionados,
        amostrasRelacionadas: r.amostrasRelacionadas,
      },
    ]);
    setCarregando(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    enviar(input);
  }

  const vazio = mensagens.length === 0 && !carregando;

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:p-6">
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col bg-canvas lg:overflow-hidden lg:rounded-card lg:border lg:border-line lg:bg-white lg:shadow-card">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-line bg-white px-5 py-3 sm:px-6">
        <button
          onClick={() => navigate('/')}
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas"
        >
          <IconBack className="h-5 w-5 text-ink" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand">
            <IconSpark className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-[15px] font-bold leading-tight">
              Representante Digital
            </div>
            <div className="text-[11.5px] text-ink-sub">
              {iaAtiva() ? 'IA · Cuidados Pela Vida' : 'Demonstração · sem chave de IA'}
            </div>
          </div>
        </div>
      </div>

      {/* mensagens */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6 lg:bg-canvas lg:px-8">
        {vazio && (
          <div className="pt-4">
            <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-bg">
              <IconSpark className="h-6 w-6 text-brand" />
            </div>
            <h2 className="mt-3 text-[17px] font-extrabold">
              Como posso ajudar hoje?
            </h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-sub">
              Tire dúvidas sobre medicamentos e tratamentos da sua
              especialidade. Respostas com base científica, no seu tempo — a
              visita médica quando você precisar.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {sugestoes.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="flex w-full items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-left text-[13.5px] font-medium text-ink transition hover:border-brand hover:bg-brand-bg"
                >
                  <IconSpark className="h-4 w-4 flex-shrink-0 text-brand" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensagens.map((m, i) => (
          <MensagemBolha key={i} msg={m} onNavConteudo={(id) => navigate(`/conteudo/${id}`)} onNavAmostra={() => navigate('/amostras')} />
        ))}

        {carregando && (
          <div className="flex items-center gap-2 text-[13px] text-ink-sub">
            <span className="flex gap-1">
              <Dot /> <Dot d={150} /> <Dot d={300} />
            </span>
            {ESTAGIOS_PENSANDO[estagio]}
          </div>
        )}
        <div ref={fimRef} />
      </div>

      {/* input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-line bg-white px-4 py-3 sm:px-6 lg:px-8"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva sua dúvida clínica…"
          className="min-w-0 flex-1 rounded-pill border border-line bg-canvas px-4 py-3 text-[14px] outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={!input.trim() || carregando}
          aria-label="Enviar"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-40"
        >
          <IconSend className="h-5 w-5" />
        </button>
      </form>
      </div>
    </div>
  );
}

function MensagemBolha({
  msg,
  onNavConteudo,
  onNavAmostra,
}: {
  msg: ChatMessage;
  onNavConteudo: (id: string) => void;
  onNavAmostra: () => void;
}) {
  if (msg.autor === 'medico') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-[14px] leading-relaxed text-white lg:max-w-[680px]">
          {msg.texto}
        </div>
      </div>
    );
  }

  const conteudos = (msg.conteudosRelacionados ?? [])
    .map((id) => CONTEUDOS.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, 2);
  const amostras = (msg.amostrasRelacionadas ?? []).slice(0, 2);

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] lg:max-w-[720px]">
        <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[14px] leading-relaxed text-ink shadow-card">
          {msg.texto}
        </div>
        {(conteudos.length > 0 || amostras.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {conteudos.map(
              (c) =>
                c && (
                  <button
                    key={c.id}
                    onClick={() => onNavConteudo(c.id)}
                    className="flex max-w-full items-center gap-1.5 rounded-pill bg-brand-bg px-3 py-1.5 text-[12px] font-semibold text-brand"
                  >
                    <IconArticle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                      {c.titulo.length > 30 ? c.titulo.slice(0, 30) + '…' : c.titulo}
                    </span>
                  </button>
                ),
            )}
            {amostras.map((nome) => {
              const existe = AMOSTRAS.some((a) => a.nome === nome);
              return (
                <button
                  key={nome}
                  onClick={onNavAmostra}
                  disabled={!existe}
                  className="flex max-w-full items-center gap-1.5 rounded-pill border border-brand/30 px-3 py-1.5 text-[12px] font-semibold text-brand disabled:opacity-50"
                >
                  <IconSample className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{nome}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-brand"
      style={{ animationDelay: `${d}ms` }}
    />
  );
}
