# File Lock Registry

## Active Locks

| File | Locked By | Batch ID | Since |
|------|-----------|----------|-------|

## Lock Protocol

1. 파일 수정 전 이 테이블 확인
2. 이미 잠긴 파일 → 잠금 해제까지 대기
3. 잠금 추가: `Locked By: {agent-id} ({batch-id})`
4. 완료 시 해당 행 제거

## Batch Lock Reservation

병렬 위임 전 claude-code가 배치 단위로 파일 잠금을 일괄 예약한다:

```
| src/components/Header.tsx | Locked By: claude-code (batch-reserve) | B-20260429-01 | 2026-04-29 |
```
