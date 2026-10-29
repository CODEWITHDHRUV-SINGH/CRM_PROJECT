import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import {
  PIPELINE_STAGES,
  type Deal,
  type DealStage,
} from '../types/deal.types';

interface DealPipelineProps {
  data: Deal[];
  isLoading: boolean;
  onDealClick: (deal: Deal) => void;
  onStageChange: (dealId: string, stage: DealStage) => void;
}

export function DealPipeline({ data, isLoading, onDealClick, onStageChange }: DealPipelineProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  function dealsByStage(stage: DealStage): Deal[] {
    return data.filter((d) => d.stage === stage);
  }

  function handleDragStart(e: React.DragEvent, dealId: string) {
    setDraggingId(dealId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dealId);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverStage(null);
  }

  function handleDragOver(e: React.DragEvent, stage: DealStage) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  }

  function handleDragLeave() {
    setDragOverStage(null);
  }

  function handleDrop(e: React.DragEvent, stage: DealStage) {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggingId;
    setDragOverStage(null);
    setDraggingId(null);
    if (dealId) {
      const deal = data.find((d) => d.id === dealId);
      if (deal && deal.stage !== stage) {
        onStageChange(dealId, stage);
      }
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#9aa19a', fontSize: 11 }}>
        Loading pipeline...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 10 }}>
      {PIPELINE_STAGES.map((stage) => {
        const stageDeals = dealsByStage(stage.key);
        const total = stageDeals.reduce((s, d) => s + d.value, 0);
        const isOver = dragOverStage === stage.key;

        return (
          <div
            key={stage.key}
            style={{
              minWidth: 260,
              width: 260,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              background: isOver ? '#fafaf8' : '#fafaf8',
              border: `1px solid ${isOver ? stage.color : '#f0f0ec'}`,
              borderRadius: 8,
              padding: 10,
              transition: 'border-color .12s, background .12s',
            }}
            onDragOver={(e) => handleDragOver(e, stage.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.key)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 10,
              borderBottom: '1px solid #f0f0ec',
              marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }} />
                <strong style={{ fontSize: 11, color: '#2b3831' }}>{stage.label}</strong>
                <span style={{ fontSize: 10, color: '#9aa19a' }}>({stageDeals.length})</span>
              </div>
              <span style={{ fontSize: 9, color: '#6d7770', fontWeight: 600 }}>
                ${(total / 1000).toFixed(0)}k
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 60 }}>
              {stageDeals.length === 0 && (
                <div style={{
                  padding: 18,
                  textAlign: 'center',
                  fontSize: 10,
                  color: '#b0b6af',
                  border: '1px dashed #e5e7e0',
                  borderRadius: 6,
                }}>
                  Drop deals here
                </div>
              )}
              {stageDeals.map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onDealClick(deal)}
                  style={{
                    padding: 10,
                    border: '1px solid #e9e9e3',
                    borderRadius: 7,
                    background: '#fff',
                    cursor: 'grab',
                    opacity: draggingId === deal.id ? 0.4 : 1,
                    boxShadow: '0 1px 3px rgba(30, 40, 33, .04)',
                    transition: 'box-shadow .12s, transform .12s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                    <strong style={{ fontSize: 11, color: '#2b3831', lineHeight: 1.35 }}>
                      {deal.name}
                    </strong>
                    <GripVertical size={12} color="#b0b6af" style={{ flexShrink: 0, marginTop: 1 }} />
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 10, color: '#8d968e' }}>
                    {deal.companyName}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <strong style={{ fontSize: 11, color: '#176451' }}>
                      ${deal.value.toLocaleString()}
                    </strong>
                    <span style={{ fontSize: 9, color: '#9aa19a' }}>{deal.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}