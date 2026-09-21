import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ExternalLink,
  RefreshCw,
  Sparkles,
  Zap,
  Globe2,
  ShieldCheck,
  BarChart3,
  Crown,
  Radio,
} from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CardSkeleton } from '@/components/ui/skeleton'
import { usePremium } from '@/hooks/use-premium'
import { useI18n } from '@/i18n'

function fmtWhen(ms: number | null): string | null {
  if (!ms) return null
  return new Date(ms).toLocaleString()
}

export default function PremiumPage() {
  const { t } = useI18n()
  const queryClient = useQueryClient()
  const { data, isLoading } = usePremium()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['premium'] })
    queryClient.invalidateQueries({ queryKey: ['models'] })
  }

  const syncNow = useMutation({
    mutationFn: () => apiFetch('/api/premium/sync', { method: 'POST' }),
    onSuccess: invalidate,
  })

  if (isLoading || !data) {
    return (
      <div>
        <PageHeader title={t('premium.title')} description={t('premium.description')} />
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  const { catalog } = data
  const live = catalog.appliedTier === 'live'

  const features = [
    {
      icon: Zap,
      title: t('premium.feature1Title'),
      desc: t('premium.feature1Desc'),
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Globe2,
      title: t('premium.feature2Title'),
      desc: t('premium.feature2Desc'),
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: ShieldCheck,
      title: t('premium.feature3Title'),
      desc: t('premium.feature3Desc'),
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: BarChart3,
      title: t('premium.feature4Title'),
      desc: t('premium.feature4Desc'),
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('premium.title')}
        description={t('premium.description')}
        actions={
          <Button variant="outline" size="sm" onClick={() => syncNow.mutate()} disabled={syncNow.isPending}>
            <RefreshCw className={syncNow.isPending ? 'animate-spin' : ''} />
            {syncNow.isPending ? t('premium.syncing') : t('premium.checkForUpdates')}
          </Button>
        }
      />

      <div className="space-y-8">
        {/* Catalog feed status */}
        <section>
          <h2 className="text-sm font-medium mb-3">{t('premium.catalogFeed')}</h2>
          <div className="rounded-3xl border bg-card p-5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <span className={`inline-block size-2 rounded-full ${live ? 'bg-emerald-500' : 'bg-emerald-500/70'}`} />
                <span className="text-sm font-medium">
                  {live ? t('premium.liveFeed') : t('premium.monthlySnapshot')}
                </span>
                <Badge variant="outline" className="font-mono text-[11px]">
                  {catalog.appliedVersion ?? t('premium.bundled')}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {t('premium.lastChecked', { when: fmtWhen(catalog.lastSyncMs) ?? t('common.never') })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {live
                ? t('premium.liveDescription')
                : t('premium.snapshotDescription')}
            </p>
            {catalog.lastError && (
              <p className="text-destructive text-xs mt-2">
                {t('premium.lastSyncProblem', { error: catalog.lastError })}
              </p>
            )}
          </div>
        </section>

        {/* Premium Coming Soon Hero Banner */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 p-6 md:p-8">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 size-56 rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                    <Crown className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-base md:text-lg font-semibold tracking-tight">
                        {t('premium.comingSoonTitle')}
                      </h2>
                      <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/20 text-[11px] font-medium">
                        <Sparkles className="size-3 mr-1" />
                        {t('premium.badgeComingSoon')}
                      </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      {t('premium.comingSoonSubtitle')}
                    </p>
                  </div>
                </div>

                <a
                  href="https://github.com/PryxIntel/free-llm-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button variant="outline" size="sm" className="gap-1.5 shadow-sm">
                    <Radio className="size-3.5 text-emerald-500 animate-pulse" />
                    <span>{t('premium.stayTuned')}</span>
                    <ExternalLink className="size-3.5 opacity-70" />
                  </Button>
                </a>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {features.map((item, idx) => (
                  <div
                    key={idx}
                    className="group rounded-2xl border border-border/60 bg-background/50 hover:bg-background/80 transition-colors p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`flex size-8 items-center justify-center rounded-xl border ${item.color}`}>
                        <item.icon className="size-4" />
                      </div>
                      <h3 className="text-xs md:text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-10.5">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-muted/40 border border-border/40 p-3.5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Open Source Guarantee:</span> Core local routing, unlimited multi-model load balancing, and offline support remain completely free forever.
                </p>
                <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                  PryxIntel v1.0.0
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
