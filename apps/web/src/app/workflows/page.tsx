'use client'

import React from 'react'
import AppShell from '@/components/layout/AppShell'
import WorkflowViewer from '@/components/workflows/WorkflowViewer'
import { useNoa } from '@/lib/noa/state'

export default function WorkflowsPage() {
  const noa = useNoa()

  return (
    <AppShell>
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Workflows</h2>
            <p className="text-sm text-gray-300 mt-1">Active, Recent, Templates</p>
          </div>
        </div>

        <div className="mt-6">
          <WorkflowViewer />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Recent Tasks</h3>
          <div className="mt-4 space-y-3">
            {noa.tasks?.length === 0 && <div className="text-gray-400">No active workflows yet.</div>}
            {noa.tasks?.map((t: any) => (
              <div key={t.id} className="p-3 bg-slate-800 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-xs text-gray-400">{t.createdAt}</div>
                  </div>
                  <div className="text-sm">{t.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
