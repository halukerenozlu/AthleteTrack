using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LookupsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/lookups/positions
        // Bu uç, veritabanındaki "Kaleci, Forvet" gibi mevkileri getirir.
        [HttpGet("positions")]
        public async Task<IActionResult> GetPositions()
        {
            var positions = await _context.Positions.ToListAsync();
            return Ok(positions);
        }
    }
}