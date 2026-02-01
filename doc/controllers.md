# Controllers

## BabyController

```csharp
using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.Baby;
using BabyCareAssistant.Application.Features.Baby.Commands;
using BabyCareAssistant.Application.Features.Baby.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BabyController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BabyDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllBabiesQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}", Name = "GetByIdAsync")]
    public async Task<ActionResult<BabyDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetBabyByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<BabyDto>> CreateAsync([FromBody] CreateBabyDto request)
    {
        var result = await sender.Send(new CreateBabyCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<BabyDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateBabyDto request)
    {
        var result = await sender.Send(new UpdateBabyCommand(id, request));

        if (!result.IsSuccess)
        {
            if (result.Error == "The ID in the URL does not match the ID in the request body.")
            {
                return BadRequest(result.Error);
            }
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await sender.Send(new DeleteBabyCommand(id));
        return NoContent();
    }
}
```

---

## FeedingController

```csharp
using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.FeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands;
using BabyCareAssistant.Application.Features.FeedingLog.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class FeedingController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FeedingLogDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllFeedingLogsQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FeedingLogDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetFeedingLogByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<FeedingLogDto>> CreateAsync([FromBody] CreateFeedingLogDto request)
    {
        var result = await sender.Send(new CreateFeedingLogCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<FeedingLogDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateFeedingLogDto request)
    {
        var result = await sender.Send(new UpdateFeedingLogCommand(id, request));

        if (!result.IsSuccess)
        {
            if (result.Error == "The ID in the URL does not match the ID in the request body.")
            {
                return BadRequest(result.Error);
            }
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        await sender.Send(new DeleteFeedingLogCommand(id));
        return NoContent();
    }
}
```

---

## GrowthLogController

```csharp
using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.GrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands;
using BabyCareAssistant.Application.Features.GrowthLog.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GrowthLogController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GrowthLogDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllGrowthLogsQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GrowthLogDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetGrowthLogByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<GrowthLogDto>> CreateAsync([FromBody] CreateGrowthLogDto request)
    {
        var result = await sender.Send(new CreateGrowthLogCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<GrowthLogDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateGrowthLogDto request)
    {
        var result = await sender.Send(new UpdateGrowthLogCommand(id, request));

        if (!result.IsSuccess)
        {
            if (result.Error == "The ID in the URL does not match the ID in the request body.")
            {
                return BadRequest(result.Error);
            }
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await sender.Send(new DeleteGrowthLogCommand(id));
        return NoContent();
    }
}
```

---

## ExcretionLogController

```csharp
using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.ExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands;
using BabyCareAssistant.Application.Features.ExcretionLog.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExcretionLogController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExcretionLogDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllExcretionLogsQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExcretionLogDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetExcretionLogByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<ExcretionLogDto>> CreateAsync([FromBody] CreateExcretionLogDto request)
    {
        var result = await sender.Send(new CreateExcretionLogCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ExcretionLogDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateExcretionLogDto request)
    {
        var result = await sender.Send(new UpdateExcretionLogCommand(id, request));

        if (!result.IsSuccess)
        {
            if (result.Error == "The ID in the URL does not match the ID in the request body.")
            {
                return BadRequest(result.Error);
            }
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await sender.Send(new DeleteExcretionLogCommand(id));
        return NoContent();
    }
}
```

---

## VaccinationRecordController

```csharp
using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.VaccinationRecord;
using BabyCareAssistant.Application.Features.VaccinationRecord.Commands;
using BabyCareAssistant.Application.Features.VaccinationRecord.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VaccinationRecordController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VaccinationRecordDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllVaccinationRecordsQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VaccinationRecordDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetVaccinationRecordByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<VaccinationRecordDto>> CreateAsync([FromBody] CreateVaccinationRecordDto request)
    {
        var result = await sender.Send(new CreateVaccinationRecordCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<VaccinationRecordDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateVaccinationRecordDto request)
    {
        var result = await sender.Send(new UpdateVaccinationRecordCommand(id, request));

        if (!result.IsSuccess)
        {
            if (result.Error == "The ID in the URL does not match the ID in the request body.")
            {
                return BadRequest(result.Error);
            }
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await sender.Send(new DeleteVaccinationRecordCommand(id));
        return NoContent();
    }
}
```

---

## VaccineCatalogController

```csharp
using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Dtos.VaccineCatalog;
using BabyCareAssistant.Application.Features.VaccineCatalog.Commands;
using BabyCareAssistant.Application.Features.VaccineCatalog.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BabyCareAssistant.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VaccineCatalogController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VaccineCatalogDto>>> GetAllAsync()
    {
        var result = await sender.Send(new GetAllVaccineCatalogsQuery());
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VaccineCatalogDto>> GetByIdAsync([FromRoute] Guid id)
    {
        var result = await sender.Send(new GetVaccineCatalogByIdQuery(id));

        if (!result.IsSuccess)
        {
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<VaccineCatalogDto>> CreateAsync([FromBody] CreateVaccineCatalogDto request)
    {
        var result = await sender.Send(new CreateVaccineCatalogCommand(request));
        return CreatedAtRoute(nameof(GetByIdAsync), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<VaccineCatalogDto>> UpdateAsync([FromRoute] Guid id, [FromBody] UpdateVaccineCatalogDto request)
    {
        var result = await sender.Send(new UpdateVaccineCatalogCommand(id, request));

        if (!result.IsSuccess)
        {
            if (result.Error == "The ID in the URL does not match the ID in the request body.")
            {
                return BadRequest(result.Error);
            }
            return NotFound();
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await sender.Send(new DeleteVaccineCatalogCommand(id));
        return NoContent();
    }
}
```
