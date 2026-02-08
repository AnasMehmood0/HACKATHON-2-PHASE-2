# Evolution of Todo - Phase I Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All features MUST follow the Spec-Kit lifecycle: **Specify → Plan → Tasks → Implement**
- No code is written without a corresponding Task ID
- Every implementation must reference spec sections
- Constitution → Specify → Plan → Tasks hierarchy applies for conflicts
- Agents must stop and request clarification if anything is underspecified

### II. Clean Code & Python Standards
- **PEP 8 Compliance**: All code follows Python style guidelines
- **Type Hints Required**: All functions use Python type annotations
- **Docstrings**: All public functions/modules have descriptive docstrings
- **Simplicity**: YAGNI (You Aren't Gonna Need It) - only implement what's specified
- **No Over-Engineering**: Prefer simple solutions over abstractions

### III. In-Memory Storage (Phase I)
- Tasks are stored in memory only using Python data structures
- No file I/O, databases, or persistence mechanisms
- Data lost when application exits
- This is intentional for Phase I learning purposes

### IV. Console Interface
- Text-based CLI using stdin/stdout
- Simple command structure: `command [args]`
- Clear help text and usage instructions
- Graceful error handling for invalid input

### V. Minimum Viable Product
- Implement only the 5 core features specified
- No extra features beyond requirements
- Each feature independently testable
- Incremental delivery: each user story adds value

## Technology Stack Constraints

### Required
- Python 3.13+
- UV package manager
- Standard library only (no external dependencies for Phase I)

### Prohibited (for Phase I)
- File persistence
- Database connections
- External API calls
- Web frameworks
- GUI libraries

## Development Workflow

### Spec-Kit Lifecycle
1. **Specify**: Define user stories, requirements, acceptance criteria
2. **Plan**: Design architecture, components, interfaces
3. **Tasks**: Break down into atomic, testable work units
4. **Implement**: Write code referencing Task IDs

### Quality Gates
- All code must pass constitutional principles check
- Each user story must be independently testable
- Type hints required on all functions
- Error handling for all user input paths

## Code Organization

### Project Structure
```
src/
├── models/      # Data models
├── services/    # Business logic
├── cli/         # Console interface
└── main.py      # Entry point

tests/           # Tests (optional)
specs/           # Specifications
history/         # PHRs and ADRs
```

### Module Rules
- Each module has single responsibility
- Models contain data structures only
- Services contain business logic only
- CLI contains presentation logic only
- No circular imports

## Testing Strategy

### Unit Tests (Optional)
- Test individual functions in isolation
- Mock in-memory state as needed

### Integration Tests (Optional)
- Test user workflows end-to-end
- Verify command inputs produce expected outputs

### Manual Testing (Required)
- Each user story verified independently
- Edge cases tested manually
- Error scenarios validated

## Governance

### Amendment Process
- Constitution changes require explicit documentation
- Technical decisions must reference constitution principles
- Violations must be justified and documented

### Compliance
- All pull requests must verify constitutional compliance
- Complexity must be justified against MVP principle
- When in doubt, choose simpler approach

**Version**: 1.0.0 | **Ratified**: 2025-02-06 | **Last Amended**: 2025-02-06
