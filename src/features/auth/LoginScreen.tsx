import { useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ESPECIALIDADES, UFS } from '@/data/mockData';
import type { Especialidade, Papel } from '@/types';
import { AppShell } from '@/components/AppShell';
import { BrandLogo } from '@/components/BrandLogo';
import visitDigitalImg from '@/assets/illustrations/visit-digital.png';

export function LoginScreen() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [papel, setPapel] = useState<Papel>('medico');
  const [nome, setNome] = useState('');
  const [crm, setCrm] = useState('');
  const [uf, setUf] = useState('SP');
  const [especialidade, setEspecialidade] =
    useState<Especialidade>('Cardiologia');
  const [erro, setErro] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (nome.trim().length < 3) {
      setErro('Informe seu nome completo.');
      return;
    }
    if (papel === 'medico' && !/^\d{4,7}$/.test(crm.trim())) {
      setErro('Informe um CRM válido (4 a 7 dígitos).');
      return;
    }
    login({
      papel,
      nome: nome.trim(),
      crm: papel === 'medico' ? crm.trim() : '',
      uf,
      especialidade,
    });
    navigate('/');
  }

  function entrarComoDemo() {
    login({
      papel: 'medico',
      nome: 'Dr. Pedro Sanches',
      crm: '123456',
      uf: 'SP',
      especialidade: 'Cardiologia',
    });
    navigate('/');
  }

  function entrarComoRepresentanteDemo() {
    login({
      papel: 'representante',
      nome: 'Ana Beatriz Souza',
      crm: '',
      uf: 'SP',
      especialidade: 'Clínica Geral',
    });
    navigate('/');
  }

  return (
    <AppShell>
      <div className="no-scrollbar flex-1 overflow-y-auto bg-brand-deep">
        <div className="mx-auto grid min-h-full w-full max-w-6xl items-center gap-8 px-6 py-10 text-white sm:px-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-10">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-5 w-fit max-w-full rounded-2xl bg-white px-4 py-3 shadow-soft">
              <BrandLogo className="h-[28px] sm:h-[31px]" />
            </div>
            <h1 className="text-[26px] font-extrabold sm:text-[34px]">
              Visita médica digital
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-soft sm:text-base">
              Portal do Médico · Cuidados Pela Vida
            </p>
            <img
              src={visitDigitalImg}
              alt=""
              className="mt-8 hidden w-full max-w-md rounded-[24px] shadow-soft lg:block"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full rounded-[24px] bg-white p-5 text-ink shadow-xl sm:p-6"
          >
            <h2 className="mb-1 text-lg font-bold">Acesse sua conta</h2>
            <p className="mb-4 text-[13px] text-ink-sub">
              Identifique-se com seu registro profissional.
            </p>

            <div className="mb-4 grid grid-cols-2 gap-2 rounded-pill bg-canvas p-1">
              <button
                type="button"
                onClick={() => setPapel('medico')}
                className={`rounded-pill py-2 text-[13px] font-semibold transition ${
                  papel === 'medico' ? 'bg-brand text-white' : 'text-ink-sub'
                }`}
              >
                Médico
              </button>
              <button
                type="button"
                onClick={() => setPapel('representante')}
                className={`rounded-pill py-2 text-[13px] font-semibold transition ${
                  papel === 'representante' ? 'bg-brand text-white' : 'text-ink-sub'
                }`}
              >
                Representante
              </button>
            </div>

            <Field label="Nome completo">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={
                  papel === 'medico' ? 'Dr(a). Nome Sobrenome' : 'Nome Sobrenome'
                }
                className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </Field>

            {papel === 'medico' ? (
              <>
                <div className="grid grid-cols-[minmax(0,1fr)_5.75rem] gap-3">
                  <Field label="CRM">
                    <input
                      value={crm}
                      onChange={(e) => setCrm(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      inputMode="numeric"
                      className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none focus:border-brand"
                    />
                  </Field>
                  <Field label="UF">
                    <select
                      value={uf}
                      onChange={(e) => setUf(e.target.value)}
                      className="w-full rounded-xl border border-line bg-canvas px-3 py-3 text-sm outline-none focus:border-brand"
                    >
                      {UFS.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Especialidade">
                  <select
                    value={especialidade}
                    onChange={(e) =>
                      setEspecialidade(e.target.value as Especialidade)
                    }
                    className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none focus:border-brand"
                  >
                    {ESPECIALIDADES.map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                </Field>
              </>
            ) : (
              <Field label="Região de atuação (UF)">
                <select
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  {UFS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </Field>
            )}

            {erro && <p className="mb-3 text-[13px] text-red-600">{erro}</p>}

            <button type="submit" className="btn btn-primary btn-block btn-md">
              Entrar
            </button>
            <button
              type="button"
              onClick={
                papel === 'medico' ? entrarComoDemo : entrarComoRepresentanteDemo
              }
              className="btn btn-secondary btn-block btn-md mt-3"
            >
              Entrar com perfil demo
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`mb-4 block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </span>
      {children}
    </label>
  );
}
