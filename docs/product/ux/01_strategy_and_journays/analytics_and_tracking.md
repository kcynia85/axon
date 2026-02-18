### Event Tracking (PostHog/Mixpanel)**

`Event Categories:

Page Views:
├─ page_viewed
│  └─ Properties: path, user_id, timestamp

User Actions:
├─ project_created
├─ project_deleted
├─ agent_created
├─ agent_edited
├─ agent_deleted
├─ crew_created
├─ pattern_saved
├─ template_created
├─ knowledge_hub_created
├─ source_uploaded
├─ node_executed
├─ node_failed
├─ artifact_approved
├─ automation_triggered
├─ search_performed
├─ filter_applied
└─ bulk_action_performed

Navigation:
├─ navigation_occurred
│  └─ Properties: from_path, to_path, method (click/keyboard/back)

Feature Usage:
├─ canvas_opened
├─ sidebar_toggled
├─ inspector_opened
├─ modal_opened
├─ settings_changed
└─ workspace_switched

Errors:
├─ error_occurred
│  └─ Properties: error_type, error_message, stack_trace, user_action
├─ api_error
│  └─ Properties: endpoint, status_code, error_message
└─ validation_error
   └─ Properties: field_name, validation_rule, user_input`

---

### Event Properties**

`Standard Properties (all events):
├─ event_name: string
├─ timestamp: ISO 8601 datetime
├─ user_id: UUID
├─ session_id: UUID
├─ page_path: string
├─ user_agent: string
├─ screen_resolution: string
└─ device_type: "desktop" | "tablet" | "mobile"

Custom Properties (per event):

project_created:
├─ project_id: UUID
├─ project_name: string
├─ has_linked_space: boolean
└─ creation_method: "manual" | "template" | "import"

agent_created:
├─ agent_id: UUID
├─ agent_name: string
├─ workspace: string
├─ has_rag: boolean
├─ num_tools: number
├─ llm_model: string
├─ creation_method: "from_archetype" | "from_scratch"
└─ time_to_create: seconds

node_executed:
├─ node_id: UUID
├─ node_type: "agent" | "crew" | "pattern"
├─ execution_time: seconds
├─ tokens_used: number
├─ cost: number
├─ status: "success" | "error" | "timeout"
└─ error_type: string (if failed)

search_performed:
├─ search_term: string
├─ results_count: number
├─ result_clicked: boolean
├─ click_position: number (if clicked)
└─ context: "projects" | "agents" | "global"

filter_applied:
├─ filter_type: string
├─ filter_values: array
├─ results_count: number
└─ context: "projects" | "agents" | etc.`

---

### User Behavior Metrics**

`Engagement Metrics:
├─ Daily Active Users (DAU)
├─ Weekly Active Users (WAU)
├─ Monthly Active Users (MAU)
├─ Session Duration (avg)
├─ Sessions per User (avg)
├─ Pages per Session (avg)
└─ Feature Adoption Rate

Feature Usage:
├─ Canvas: % of users who create workflows
├─ Agents: Avg agents per user
├─ Executions: Avg executions per day
├─ Knowledge Base: % with uploaded sources
└─ Settings: % who configure LLM settings

Retention:
├─ Day 1 Retention
├─ Day 7 Retention
├─ Day 30 Retention
└─ Cohort Analysis

Funnel Analysis:
1. Sign up
2. Create first project
3. Create first agent
4. Execute first node
5. Review first artifact
→ Track drop-off at each step

Time-to-Value:
├─ Time from signup to first execution
└─ Target: < 10 minutes`

---

### Performance Metrics**

`Page Load:
├─ page_load_time
│  └─ Target: < 2 seconds
├─ time_to_interactive
│  └─ Target: < 3 seconds
└─ first_contentful_paint
   └─ Target: < 1 second

API Performance:
├─ api_response_time
│  └─ By endpoint, method
│  └─ Target: < 500ms (p95)
├─ api_success_rate
│  └─ Target: > 99%
└─ api_error_rate
   └─ By status code

Canvas Performance:
├─ canvas_render_time
│  └─ Time to render 100 nodes
│  └─ Target: < 1 second
├─ node_execution_time
│  └─ By node type
└─ inspector_open_time
   └─ Target: < 100ms

File Upload:
├─ upload_time
│  └─ By file size
├─ upload_success_rate
└─ upload_error_rate

Implementation:
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(metric => trackPerformance('cls', metric.value))
getFID(metric => trackPerformance('fid', metric.value))
getFCP(metric => trackPerformance('fcp', metric.value))
getLCP(metric => trackPerformance('lcp', metric.value))
getTTFB(metric => trackPerformance('ttfb', metric.value))

// Custom timing
performance.mark('canvas_render_start')
// ... render canvas ...
performance.mark('canvas_render_end')
performance.measure('canvas_render', 'canvas_render_start', 'canvas_render_end')`

---

### Error Tracking (Sentry)**

`Error Types:
├─ JavaScript Errors (unhandled exceptions)
├─ API Errors (failed requests)
├─ Network Errors (connection issues)
├─ Validation Errors (form/input errors)
└─ Canvas Errors (node execution failures)

Error Context:
├─ User ID
├─ Session ID
├─ Page Path
├─ User Action (what user was doing)
├─ Browser/Device Info
├─ Stack Trace
└─ Breadcrumbs (recent user actions)

Example:
Sentry.captureException(error, {
  tags: {
    section: 'canvas',
    action: 'node_execution'
  },
  contexts: {
    node: {
      id: nodeId,
      type: nodeType,
      status: executionStatus
    }
  },
  user: {
    id: userId,
    email: userEmail
  }
})

Error Alerts:
├─ Critical: Slack alert immediately
│  └─ App crash, auth failure, data loss
├─ High: Email within 15 minutes
│  └─ API errors affecting >10 users
└─ Medium: Daily digest
   └─ Validation errors, minor UI issues`

---

### Feature Flags**

`Use: Control feature rollout, A/B testing

Implementation:
├─ Service: PostHog Feature Flags or LaunchDarkly
├─ Check: if (featureFlags.get('new-canvas-layout'))
└─ Track: Feature flag evaluated (for metrics)

Flags:
├─ canvas_v2_layout: Boolean (new Canvas UI)
├─ bulk_actions: Boolean (enable bulk actions)
├─ global_search: Boolean (Cmd+K search)
├─ collaboration_mode: Boolean (real-time collaboration)
└─ ai_suggestions: Boolean (AI-powered suggestions)

A/B Tests:
├─ onboarding_flow: "v1" | "v2"
├─ pricing_page: "simple" | "detailed"
└─ agent_creation: "wizard" | "single_page"

Gradual Rollout:
├─ Enable for 5% of users
├─ Monitor metrics (errors, usage)
├─ If good: Increase to 25%, 50%, 100%
└─ If bad: Rollback to 0%`

---

### Privacy & GDPR Compliance**

`User Consent:
├─ Cookie Banner: Show on first visit
├─ Options:
│  ├─ Essential: Required (no opt-out)
│  ├─ Analytics: Optional (can opt-out)
│  └─ Marketing: Optional (can opt-out)
└─ Store: Preference in localStorage

Data Collected:
├─ WITH consent:
│  ├─ User ID (hashed)
│  ├─ Usage events
│  ├─ Performance metrics
│  └─ Error logs
└─ WITHOUT consent:
   ├─ Essential errors only
   └─ No user identification

Data Retention:
├─ Analytics: 90 days
├─ Error logs: 30 days
├─ User profiles: Until account deletion
└─ Session data: 24 hours

User Rights:
├─ View Data: Export all analytics data
├─ Delete Data: Delete all analytics data
├─ Opt-Out: Stop tracking immediately
└─ Access: View what data is collected

Implementation:
// Check consent before tracking
if (hasAnalyticsConsent()) {
  trackEvent('page_viewed', properties)
}

// Allow user to opt-out anytime
optOutOfAnalytics()`

---

###  Dashboard & Reporting**

`Admin Dashboard (PostHog/Mixpanel):
├─ Real-time: Current active users
├─ Daily Stats: DAU, executions, errors
├─ Trends: Week-over-week growth
├─ Funnels: Conversion rates
├─ Cohorts: Retention by signup date
└─ Feature Usage: Adoption rates

Key Metrics to Track:
├─ User Growth: New signups, churn rate
├─ Engagement: Sessions, duration, frequency
├─ Product Usage: Agents created, nodes executed
├─ Performance: Page load, API response times
├─ Errors: Error rate, types, affected users
└─ Revenue (future): MRR, ARPU, LTV

Alerts:
├─ Spike in errors: > 10 per minute
├─ Drop in DAU: > 20% decrease
├─ Slow performance: p95 > 3 seconds
├─ API failures: > 5% error rate
└─ Feature adoption: < 10% after 2 weeks

Weekly Report (automated email):
├─ User Growth: +5% (123 new users)
├─ Top Features: Canvas (80%), Agents (65%)
├─ Performance: Avg load time 1.2s (↓0.2s)
├─ Errors: 45 errors (↓20 from last week)
└─ Action Items: 3 features underperforming`