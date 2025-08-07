import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Play, RotateCcw, Trash2, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { IconButton } from '../../styles/GlobalStyles';
import { useApp } from '../../contexts/AppContext';

const JobQueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const QueueContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StatusOverview = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const StatusCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const StatusIcon = styled.div<{ status: 'running' | 'pending' | 'completed' | 'failed' }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    switch (props.status) {
      case 'running':
        return `background-color: #3b82f6; color: white;`;
      case 'pending':
        return `background-color: #f59e0b; color: white;`;
      case 'completed':
        return `background-color: #10b981; color: white;`;
      case 'failed':
        return `background-color: #ef4444; color: white;`;
      default:
        return `background-color: #6b7280; color: white;`;
    }
  }}
`;

const StatusInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusCount = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const StatusLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const JobsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.md};
`;

const JobItem = styled.div<{ status: 'running' | 'pending' | 'completed' | 'failed'; isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
  background-color: ${props => props.isSelected ? '#3d65a5ff' : props.theme.colors.tertiary};
  border-radius: 4px;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'running': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.isSelected ? '#3d65a5ff' : props.theme.colors.hover};
  }
`;

const JobInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 10px;
`;

const JobName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const JobMeta = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const JobActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

interface Job {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'pending' | 'completed' | 'failed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  progress?: number;
  error?: string;
  jobFile?: string;
}

interface JobQueueEditorProps {}

export const JobQueueEditor: React.FC<JobQueueEditorProps> = () => {
  const { state, dispatch } = useApp();
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      name: 'Send Welcome Email',
      type: 'email',
      status: 'completed',
      createdAt: new Date('2025-01-15T10:00:00'),
      startedAt: new Date('2025-01-15T10:00:05'),
      completedAt: new Date('2025-01-15T10:00:10'),
      jobFile: '/jobs/WelcomeWorkflow.job',
    },
    {
      id: '2',
      name: 'Process Image Upload',
      type: 'image-processing',
      status: 'running',
      createdAt: new Date('2025-01-15T10:05:00'),
      startedAt: new Date('2025-01-15T10:05:02'),
      progress: 65,
    },
    {
      id: '3',
      name: 'Generate Report',
      type: 'report',
      status: 'pending',
      createdAt: new Date('2025-01-15T10:10:00'),
    },
    {
      id: '4',
      name: 'Database Backup',
      type: 'backup',
      status: 'failed',
      createdAt: new Date('2025-01-15T09:30:00'),
      startedAt: new Date('2025-01-15T09:30:05'),
      error: 'Connection timeout',
    },
  ]);

  useEffect(() => {
    const handleAddJob = () => {
      addJob();
    };

    window.addEventListener('queue-add-job', handleAddJob);

    return () => {
      window.removeEventListener('queue-add-job', handleAddJob);
    };
  }, []);

  const addJob = () => {
    const newJob: Job = {
      id: `job_${Date.now()}`,
      name: 'New Job',
      type: 'custom',
      status: 'pending',
      createdAt: new Date(),
    };
    setJobs([...jobs, newJob]);
  };

  const retryJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: 'pending' as const, error: undefined } : job
    ));
  };

  const removeJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const selectJob = (job: Job) => {
    dispatch({ type: 'SELECT_QUEUE_JOB', payload: job });
  };

  const updateJobFile = (jobId: string, jobFile: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, jobFile } : job
    ));
  };

  useEffect(() => {
    const handleJobFileUpdate = (event: any) => {
      if (state.selectedQueueJob && event.detail) {
        updateJobFile(state.selectedQueueJob.id, event.detail.jobFile);
      }
    };

    window.addEventListener('queue-job-file-update', handleJobFileUpdate);

    return () => {
      window.removeEventListener('queue-job-file-update', handleJobFileUpdate);
    };
  }, [state.selectedQueueJob]);

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'failed':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getJobMeta = (job: Job) => {
    const formatTime = (date: Date) => date.toLocaleTimeString();
    
    switch (job.status) {
      case 'running':
        return `Started: ${job.startedAt ? formatTime(job.startedAt) : 'N/A'} • Progress: ${job.progress || 0}%`;
      case 'pending':
        return `Queued: ${formatTime(job.createdAt)}`;
      case 'completed':
        return `Completed: ${job.completedAt ? formatTime(job.completedAt) : 'N/A'}`;
      case 'failed':
        return `Failed: ${job.error || 'Unknown error'}`;
      default:
        return `Created: ${formatTime(job.createdAt)}`;
    }
  };

  const getStatusCounts = () => {
    const counts = {
      running: jobs.filter(j => j.status === 'running').length,
      pending: jobs.filter(j => j.status === 'pending').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <JobQueueContainer>
      <QueueContent>
        <StatusOverview>
          <StatusCard>
            <StatusIcon status="running">
              <Play size={12} />
            </StatusIcon>
            <StatusInfo>
              <StatusCount>{statusCounts.running}</StatusCount>
              <StatusLabel>Running</StatusLabel>
            </StatusInfo>
          </StatusCard>

          <StatusCard>
            <StatusIcon status="pending">
              <Clock size={12} />
            </StatusIcon>
            <StatusInfo>
              <StatusCount>{statusCounts.pending}</StatusCount>
              <StatusLabel>Pending</StatusLabel>
            </StatusInfo>
          </StatusCard>

          <StatusCard>
            <StatusIcon status="completed">
              <CheckCircle size={12} />
            </StatusIcon>
            <StatusInfo>
              <StatusCount>{statusCounts.completed}</StatusCount>
              <StatusLabel>Completed</StatusLabel>
            </StatusInfo>
          </StatusCard>

          <StatusCard>
            <StatusIcon status="failed">
              <XCircle size={12} />
            </StatusIcon>
            <StatusInfo>
              <StatusCount>{statusCounts.failed}</StatusCount>
              <StatusLabel>Failed</StatusLabel>
            </StatusInfo>
          </StatusCard>
        </StatusOverview>

        <JobsContainer>
          {jobs.map(job => (
            <JobItem 
              key={job.id} 
              status={job.status}
              isSelected={state.selectedQueueJob?.id === job.id}
              onClick={() => selectJob(job)}
            >
              <StatusIcon status={job.status}>
                {getJobStatusIcon(job.status)}
              </StatusIcon>
              <JobInfo>
                <JobName>{job.name}</JobName>
                <JobMeta>{getJobMeta(job)}</JobMeta>
              </JobInfo>
              <JobActions>
                {job.status === 'failed' && (
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      retryJob(job.id);
                    }}
                    title="Retry Job"
                  >
                    <RotateCcw size={14} />
                  </IconButton>
                )}
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeJob(job.id);
                  }}
                  title="Remove Job"
                >
                  <Trash2 size={14} />
                </IconButton>
              </JobActions>
            </JobItem>
          ))}
        </JobsContainer>
      </QueueContent>
    </JobQueueContainer>
  );
};