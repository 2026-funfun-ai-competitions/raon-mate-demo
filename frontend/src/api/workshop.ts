import apiClient from './client'

export type WorkshopType = 'DAY_TRIP' | 'OVERNIGHT'

export type WorkshopStatus =
  | 'DRAFT'
  | 'SURVEY_OPEN'
  | 'SURVEY_CLOSED'
  | 'ANALYZING'
  | 'PROPOSAL_VOTING'
  | 'CONFIRMED'
  | 'PLAN_COMPLETED'

export interface WorkshopCreateRequest {
  title: string
  departureLocation?: string
  preferredRegion: string
  expectedParticipants?: number
  budgetPerPerson?: number
  responseDeadline?: string
  requiredConditions?: string
  workshopType?: WorkshopType
  preferredStartDate?: string
  preferredEndDate?: string
  purposeKeywords?: string
}

export interface WorkshopUpdateRequest {
  title: string
  preferredRegion: string
  expectedParticipants?: number
  budgetPerPerson?: number
  workshopType?: WorkshopType
  preferredStartDate?: string
  preferredEndDate?: string
  purposeKeywords?: string
  requiredConditions?: string
}

export interface WorkshopResponse {
  id: string
  title: string
  departureLocation: string
  preferredRegion: string
  expectedParticipants: number
  budgetPerPerson: number
  responseDeadline: string | null
  requiredConditions: string | null
  workshopType: WorkshopType
  preferredStartDate: string
  preferredEndDate: string
  purposeKeywords: string
  selectedVenuePlaceIds: string[]
  status: WorkshopStatus
  createdAt: string
  updatedAt: string
}

export interface VenueRecommendationRequest {
  latitude?: number
  longitude?: number
  maxResults?: number
  additionalRequest?: string
}

export interface Venue {
  rank: number
  name: string
  address: string
  category: string
  // AI(Gemini)가 생성하는 값이라 누락되거나 null일 수 있다 — 렌더링 시 방어적으로 다뤄야 한다.
  estimatedCostPerPerson: number | null
  estimatedTotalCost: number | null
  score: number | null
  tags: string[] | null
  reasons: string[] | null
  cautions: string[] | null
  rating: number | null
  reviewCount: number | null
  imageUri: string | null
  mapUri: string | null
  placeId: string
}

export interface MapSource {
  title: string
  uri: string
  placeId: string
}

export interface VenueRecommendationResponse {
  recommendations: Venue[]
  sources: MapSource[]
  model: string
  generatedAt: string
}

export interface ScheduleItem {
  date: string
  startTime: string
  endTime?: string | null
  type: string
  title: string
  description?: string | null
}

export interface ScheduleResponse {
  id: string
  workshopId: string
  items: ScheduleItem[]
  updatedAt: string
}

// The live backend response for budget items does not match the OpenAPI
// spec's documented `Item` schema (date/startTime/type/title/description) —
// verified against the running server, actual items look like this instead.
export interface BudgetItem {
  category: string
  name: string
  amount: number
  note?: string | null
  perPersonAmount: number
  percentage: number
}

export interface BudgetResponse {
  id: string
  workshopId: string
  expectedParticipants: number
  budgetPerPerson: number
  items: BudgetItem[]
  totalAmount: number
  estimatedPerPerson: number
  limitAmount: number
  remainingAmount: number
  usagePercent: number
  updatedAt: string
}

export type NotificationChannel = 'SLACK' | 'EMAIL'

export interface NotificationSendRequest {
  channel: NotificationChannel
  recipientCount: number
  message: string
}

export interface NotificationResponse {
  id: string
  workshopId: string
  channel: string
  recipientCount: number
  message: string
  status: string
  sentAt: string
}

export function createWorkshop(data: WorkshopCreateRequest) {
  return apiClient.post<WorkshopResponse>('/api/workshops', data).then((res) => res.data)
}

// Gemini + Google Maps 호출이 포함돼 있어 응답까지 수십 초가 걸릴 수 있다.
export function recommendVenues(workshopId: string, request: VenueRecommendationRequest = {}) {
  return apiClient
    .post<VenueRecommendationResponse>(
      `/api/workshops/${workshopId}/venue-recommendations`,
      request,
      { timeout: 90_000 },
    )
    .then((res) => res.data)
}

export function selectVenues(workshopId: string, placeIds: string[]) {
  return apiClient
    .put<string[]>(`/api/workshops/${workshopId}/venue-recommendations/selection`, { placeIds })
    .then((res) => res.data)
}

export function generateSchedule(workshopId: string) {
  return apiClient
    .post<ScheduleResponse>(`/api/workshops/${workshopId}/schedule/generate`)
    .then((res) => res.data)
}

export function initializeBudget(workshopId: string) {
  return apiClient
    .post<BudgetResponse>(`/api/workshops/${workshopId}/budget/initialize`)
    .then((res) => res.data)
}

export function sendNotification(workshopId: string, request: NotificationSendRequest) {
  return apiClient
    .post<NotificationResponse>(`/api/workshops/${workshopId}/notifications/send`, request)
    .then((res) => res.data)
}

export function listWorkshops() {
  return apiClient.get<WorkshopResponse[]>('/api/workshops').then((res) => res.data)
}

export function getWorkshop(workshopId: string) {
  return apiClient.get<WorkshopResponse>(`/api/workshops/${workshopId}`).then((res) => res.data)
}

export function updateWorkshop(workshopId: string, data: WorkshopUpdateRequest) {
  return apiClient
    .put<WorkshopResponse>(`/api/workshops/${workshopId}`, data)
    .then((res) => res.data)
}

export function getLatestVenueRecommendation(workshopId: string) {
  return apiClient
    .get<VenueRecommendationResponse>(`/api/workshops/${workshopId}/venue-recommendations`)
    .then((res) => res.data)
}

export function getSchedule(workshopId: string) {
  return apiClient
    .get<ScheduleResponse>(`/api/workshops/${workshopId}/schedule`)
    .then((res) => res.data)
}

export function updateSchedule(workshopId: string, items: ScheduleItem[]) {
  return apiClient
    .put<ScheduleResponse>(`/api/workshops/${workshopId}/schedule`, { items })
    .then((res) => res.data)
}

export function getBudget(workshopId: string) {
  return apiClient.get<BudgetResponse>(`/api/workshops/${workshopId}/budget`).then((res) => res.data)
}

export function updateBudget(workshopId: string, items: BudgetItem[]) {
  return apiClient
    .put<BudgetResponse>(`/api/workshops/${workshopId}/budget`, { items })
    .then((res) => res.data)
}

export function listNotifications(workshopId: string) {
  return apiClient
    .get<NotificationResponse[]>(`/api/workshops/${workshopId}/notifications`)
    .then((res) => res.data)
}
