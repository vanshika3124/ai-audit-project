# Test Documentation

### Unit Tests (Audit Engine)
* **Test Case 1**: Single tool (10 seats @ $20) -> Expected: $2,400 Annual Leakage. (Passed)
* **Test Case 2**: Zero seats/Zero spend -> Expected: $0. (Passed)
* **Test Case 3**: Multi-tool stack consolidation logic. (Passed)

### UI/UX Tests
* **Responsiveness**: Verified layout on iPhone 15, iPad Pro, and Desktop 4K. (Passed)
* **Validation**: Modal pops up correctly when email field is empty or invalid. (Passed)
* **Persistence**: Verified data successfully reaches Supabase `leads` table. (Passed)